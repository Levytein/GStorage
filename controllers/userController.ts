import { Request, Response } from "express";
import session from "express-session";
import prisma from "../prisma/prisma";
import { validationResult } from "express-validator";
import "../config/passportConfig";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { Strategy as LocalStrategy } from "passport-local";
import buildFolderTree from "../helper/buildTree";
import getFileIcon from "../helper/getFileIcon";
dotenv.config();

declare module "express-session" {
	interface SessionData {
		user: any;
		token: string;
	}
}
dotenv.config();

const supabaseUrl = process.env.PROJECT_URL as string;
const supabaseKey = process.env.LETTUCE as string;

export const supabase = createClient(supabaseUrl, supabaseKey);
async function getFolderTreeForUser(userId: string) {
	const allFolders = await prisma.folder.findMany({
		where: { ownerId: userId },
	});

	return buildFolderTree(allFolders);
}
export const uploadFile = async (req: Request, res: Response) => {
	const errors = [];
	const userId = req.session.user.id;
	try {
		if (!req.session.user) {
			errors.push({ error: "User is not authenticated." });
			return res.render("index", {
				user: null,
				errors,
				success: null,
				files: [],
				folderTree: [],
			});
		}

		if (!req.file) {
			// Get folder tree for navigation
			const folderTree = await getFolderTreeForUser(userId);

			errors.push({ error: "No file uploaded." });
			return res.render("index", {
				user: req.session.user,
				errors,
				success: null,
				files: [],
				folderTree,
				currentFolderName: null,
				currentFolderId: null,
			});
		}

		const filePath = `${userId}/${Date.now()}-${req.file.originalname}`;

		// Upload the file to storage
		const { data, error } = await supabase.storage
			.from("uploads")
			.upload(filePath, req.file.buffer, {
				contentType: req.file.mimetype,
				cacheControl: "3600",
				upsert: false,
			});

		if (error) {
			throw error;
		}

		// Retrieve the parent folder name from the form data (if any)
		const parentFolderName = req.body.parentFolderName
			? req.body.parentFolderName
			: null;

		// If parent folder name exists, get the folder ID
		let folderId = null;
		if (parentFolderName) {
			const folder = await prisma.folder.findFirst({
				where: {
					name: parentFolderName,
					ownerId: userId,
				},
			});

			if (folder) {
				folderId = folder.id;
			}
		}

		await prisma.file.create({
			data: {
				authorId: userId,
				title: req.file.originalname,
				filepath: filePath,
				mimetype: req.file.mimetype,
				folderID: folderId,
			},
		});

		console.log("File sent");

		// Redirect based on whether a parent folder name is provided.
		if (parentFolderName) {
			res.redirect(
				`/folder?folderName=${encodeURIComponent(parentFolderName)}`
			);
		} else {
			res.redirect("/home");
		}
	} catch (error) {
		console.error("Upload error:", error);

		// Get folder tree even in error case
		const folderTree = await getFolderTreeForUser(userId);

		errors.push({ error: "Something went wrong" });
		res.render("index", {
			user: req.session.user,
			errors,
			success: null,
			files: [],
			folderTree,
			currentFolderName: null,
			currentFolderId: null,
		});
	}
};
export const signUpPage = async (req: Request, res: Response) => {
	try {
		res.render("sign-up-form", { errors: [] });
	} catch (err) {
		console.error("Error fetching messages:", err);
		res.status(500).send("Internal Server Error");
	}
};
export const loadInitial = async (req: Request, res: Response) => {
	try {
		res.render("log-in", { errors: [], successes: [] });
	} catch (err) {
		console.error("Error fetching messages:", err);
		res.status(500).send("Internal Server Error");
	}
};
export const loadFolder = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user.id;
    
    // Get folder tree for navigation
    const folderTree = await getFolderTreeForUser(userId);
    
    // Get root-level files and folders
    const filesFromDb = await prisma.file.findMany({
      where: {
        authorId: userId,
        folderID: null, // Root-level files
      },
    });
    
    const foldersFromDb = await prisma.folder.findMany({
      where: {
        ownerId: userId,
        parentId: null, // Root-level folders
      },
    });
    
    // Generate signed URLs for files
    const filesWithSignedUrls = await Promise.all(
      filesFromDb.map(async (file) => {
        const { data, error } = await supabase.storage
          .from("uploads")
          .createSignedUrl(file.filepath, 60);
        if (error) {
          console.error("Error generating signed URL for", file.filepath, error.message);
          return null;
        }
        return { ...file, url: data.signedUrl };
      })
    );
    
    const validFiles = filesWithSignedUrls
      .filter((file) => file !== null)
      .map((file) => ({
        ...file,
        iconClass: getFileIcon(file.title) 
      }));
    
    res.render("index", {
      user: req.session.user,
      files: validFiles,
      folders: foldersFromDb,
      successes: [],
      errors: [],
      currentFolderName: null,
      currentFolderId: null,
      folderTree
    });
  } catch (err) {
    console.error("Error loading home:", err);
    res.status(500).send("Internal Server Error");
  }

};
export const viewFolder = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user.id;
    const folderName = req.query.folderName as string;
    
    if (!folderName) {
      return res.redirect('/home');
    }
    
    // Get folder tree for navigation
    const folderTree = await getFolderTreeForUser(userId);
    
    // Find the current folder
    const currentFolder = await prisma.folder.findFirst({
      where: {
        name: folderName,
        ownerId: userId
      }
    });
    
    if (!currentFolder) {
      return res.redirect('/home');
    }
    
    // Get files in this folder
    const filesFromDb = await prisma.file.findMany({
      where: {
        authorId: userId,
        folderID: currentFolder.id
      }
    });
    
    // Get subfolders in this folder
    const subfoldersFromDb = await prisma.folder.findMany({
      where: {
        ownerId: userId,
        parentId: currentFolder.id
      }
    });
    
    // Generate signed URLs for files
    const filesWithSignedUrls = await Promise.all(
      filesFromDb.map(async (file) => {
        const { data, error } = await supabase.storage
          .from("uploads")
          .createSignedUrl(file.filepath, 60);
        if (error) {
          console.error("Error generating signed URL for", file.filepath, error.message);
          return null;
        }
        return { ...file, url: data.signedUrl };
      })
    );
    
    const validFiles = filesWithSignedUrls
      .filter((file) => file !== null)
      .map((file) => ({
        ...file,
        iconClass: getFileIcon(file.title) 
      }));
    
    res.render("index", {
      user: req.session.user,
      files: validFiles,
      folders: subfoldersFromDb,
      successes: [],
      errors: [],
      currentFolderName: folderName,
      currentFolderId: currentFolder.id,
      folderTree
    });
    
  } catch (err) {
    console.error("Error viewing folder:", err);
    res.status(500).send("Internal Server Error");
  }
};
export const newFolder = async (req: Request, res: Response) => {
	try {
		const userId = req.session.user.id;
		// Retrieve the new folder name and the current folder's name from the form
		const { folder, parentId, currentFolderName } = req.body;
		// Convert parentId to number if provided (if you're storing parent relationship by ID)
		const parsedParentId = parentId ? Number(parentId) : null;

		// Create the new folder in your database
		await prisma.folder.create({
			data: {
				name: folder,
				ownerId: userId,
				parentId: parsedParentId, // null if top-level, otherwise the parent folder's ID
			},
		});
		console.log("Folder successfully created");
		// Redirect back to the current folder view using the folder name
		// If currentFolderName exists, redirect to that folder otherwise, go to the home view
		if (currentFolderName) {
			res.redirect(
				`/folder?folderName=${encodeURIComponent(currentFolderName)}`
			);
		} else {
			res.redirect("/home");
		}
	} catch (error) {
		console.error("Something went wrong creating a folder", error);
		res.status(500).send("Internal Server Error");
	}
};

export const createAccount = async (req: Request, res: Response) => {
	const result = validationResult(req);
	const errors = result.array();

	if (!result.isEmpty()) {
		return res.render("sign-up-form", { errors: errors, successes: [] });
	}

	try {
		//Create user in supabase auth
		const { data, error } = await supabase.auth.admin.createUser({
			email: req.body.email,
			password: req.body.password,
			email_confirm: true,
		});

		if (error) {
			console.error("Sign-up error:", error.message);
			return res.render("sign-up-form", {
				errors: [...errors, { msg: error.message }],
			});
		}

		res.render("log-in", {
			errors: [],
			successes: [
				{ msg: "Account creation successful. Log in with your credentials." },
			],
		});
	} catch (err) {
		console.error("Something went wrong.", err);
		res.render("sign-up-form", { errors });
	}
};
export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			res.render("log-in", {
				errors: [{ msg: "Email and password are required" }],
			});
		}

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error("Login failed:", error.message);
			return res.render("log-in", { errors: [{ msg: error.message }] });
		}

		// Store the session token
		req.session.user = data.user;
		req.session.token = data.session?.access_token;

		//Creation of profile in db

		const existingProfile = await prisma.profile.findUnique({
			where: { id: req.session.user.id },
		});

		if (!existingProfile) {
			await prisma.profile.create({
				data: {
					id: req.session.user.id,
					username: req.session.user.email,
				},
			});
		}

		console.log("Login successful:", data.user);
		res.redirect("/home");
	} catch (err) {
		console.error("Something went wrong:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
