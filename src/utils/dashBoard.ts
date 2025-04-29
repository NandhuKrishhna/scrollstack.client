import { z } from "zod"

export interface Article {
    _id: string
    title: string
    description: string
    content: string
    category: string
    author: string
    imageUrl?: string
    tags: string[]
    status: string
    likes: number
    likedBy: string[]
    createdAt: string
    updatedAt: string
}

export const articleSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(10, "Description should be at least 10 characters"),
    content: z.string().min(50, "Content should be at least 50 characters"),
    category: z.string().min(1, "Please select a category"),
    imageUrl: z.string().optional(),
    imageBase64: z.string().optional(),
    tags: z.array(z.string()).min(1, "Add at least one tag"),
})