"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useGetUserArticlesQuery } from "../redux/api/articleApi"
import useEditArticle from "../hooks/useEditArticle"
import useDeleteArticle from "../hooks/useDeleteArticle"
import { Trash2, Edit, Loader, Plus, Eye, Camera, X } from "lucide-react"
import Header from "./Header"
import useCreateArticle, { type ArticleProps } from "../hooks/useCreateArticles"
import { Category } from "../utils/enums"
import { useSelector } from "react-redux"
import { currentUser } from "../redux/slice/userSlice"
import { z } from "zod"
import { type Article, articleSchema } from "../utils/dashBoard"

const DashboardPage = () => {
    const user = useSelector(currentUser)

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    const {
        data: articlesResponse,
        isLoading: isLoadingArticles,
        refetch,
    } = useGetUserArticlesQuery(
        {
            id: user?._id,
            search: searchTerm,
            category: selectedCategory,
            page: currentPage,
            limit: itemsPerPage,
        },
        { skip: !user?._id },
    )
    const articles = articlesResponse?.data || []

    const { handleUploardArticle, isLoading: isCreating } = useCreateArticle()
    const { handleEditArticle, isLoading: isEditing } = useEditArticle()
    const { handleDeleteArticle, loadingItems } = useDeleteArticle()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingArticle, setEditingArticle] = useState<Article | null>(null)
    const [formData, setFormData] = useState<ArticleProps & { imageBase64?: string }>({
        title: "",
        description: "",
        content: "",
        category: "",
        imageUrl: "",
        imageBase64: "",
        tags: [],
    })
    const [errors, setErrors] = useState<{
        title?: string
        description?: string
        content?: string
        category?: string
        imageUrl?: string
        imageBase64?: string
        tags?: string
    }>({})

    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [viewingArticle, setViewingArticle] = useState<Article | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    useEffect(() => {
        if (editingArticle) {
            setFormData({
                title: editingArticle.title,
                description: editingArticle.description,
                content: editingArticle.content,
                category: editingArticle.category,
                imageUrl: editingArticle.imageUrl || "",
                tags: editingArticle.tags || [],
            })

            if (editingArticle.imageUrl) {
                setImagePreview(editingArticle.imageUrl)
            } else {
                setImagePreview(null)
            }
        }
    }, [editingArticle])

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            content: "",
            category: "",
            imageUrl: "",
            imageBase64: "",
            tags: [],
        })
        setErrors({})
        setEditingArticle(null)
        setImagePreview(null)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }))
        }
    }

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tagValues = e.target.value
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== "")
        setFormData((prev) => ({ ...prev, tags: tagValues }))
        if (errors.tags) {
            setErrors((prev) => ({ ...prev, tags: undefined }))
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, imageBase64: "Image size should be less than 5MB" }))
            return
        }

        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = () => {
            const base64Image = reader.result as string
            setFormData((prev) => ({
                ...prev,
                imageBase64: base64Image,
                imageUrl: "",
            }))
            setImagePreview(base64Image)

            if (errors.imageBase64) {
                setErrors((prev) => ({ ...prev, imageBase64: undefined }))
            }
        }

        reader.onerror = () => {
            setErrors((prev) => ({ ...prev, imageBase64: "Failed to read image file" }))
        }
    }

    const clearImageUpload = () => {
        setFormData((prev) => ({ ...prev, imageBase64: "", imageUrl: "" }))
        setImagePreview(null)
    }

    const validateForm = () => {
        try {
            articleSchema.parse(formData)
            setErrors({})
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors: { [key: string]: string } = {}
                error.errors.forEach((err) => {
                    const path = err.path[0] as string
                    formattedErrors[path] = err.message
                })
                setErrors(formattedErrors)
            }
            return false
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }
        const articleData = { ...formData }
        if (articleData.imageBase64) {
            articleData.imageUrl = articleData.imageBase64
            delete articleData.imageBase64
        }

        if (editingArticle) {
            await handleEditArticle({
                id: editingArticle._id,
                articleData,
            })
        } else {
            await handleUploardArticle(articleData)
        }

        setIsModalOpen(false)
        resetForm()
        refetch()
    }

    const confirmDelete = async (id: string) => {
        await handleDeleteArticle(id)
        refetch()
    }

    const openEditModal = (article: Article) => {
        setEditingArticle(article)
        setIsModalOpen(true)
    }

    const openAddModal = () => {
        resetForm()
        setIsModalOpen(true)
    }

    const viewArticle = (articleId: string) => {
        const article = articles.find((a: Article) => a._id === articleId)
        if (article) {
            setViewingArticle(article)
            setIsViewModalOpen(true)
        }
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, selectedCategory])

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">My Articles</h1>
                    <button
                        onClick={openAddModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add New Article
                    </button>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                Search Articles
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="search"
                                    placeholder="Search by title or content..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    onClick={() => refetch()}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="md:w-1/4">
                            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                Filter by Category
                            </label>
                            <select
                                id="category-filter"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Categories</option>
                                {Object.values(Category).map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="md:w-1/6">
                            <label htmlFor="items-per-page" className="block text-sm font-medium text-gray-700 mb-1">
                                Items Per Page
                            </label>
                            <select
                                id="items-per-page"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>
                </div>

                {isLoadingArticles ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="animate-spin h-8 w-8 text-blue-600" />
                    </div>
                ) : articles && articles.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Likes
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Published
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {articles.map((article: Article) => (
                                    <tr key={article._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        src={article.imageUrl || "/placeholder.svg"}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{article.title}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {article.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${article.status === "Published"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {article.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.likes}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(article.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => viewArticle(article._id)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="View Article"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(article)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                    title="Edit Article"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(article._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    disabled={loadingItems[article._id]}
                                                    title="Delete Article"
                                                >
                                                    {loadingItems[article._id] ? (
                                                        <Loader className="animate-spin" size={18} />
                                                    ) : (
                                                        <Trash2 size={18} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <p className="text-lg text-gray-600">You haven't created any articles yet.</p>
                        <button
                            onClick={openAddModal}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Create Your First Article
                        </button>
                    </div>
                )}

                {articlesResponse?.data && articlesResponse.data.length > 0 && (
                    <div className="mt-6 flex justify-between items-center">
                        <div className="text-sm text-gray-700">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                            {Math.min(currentPage * itemsPerPage, articlesResponse.data.length)} of {articlesResponse.data.length}{" "}
                            articles
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {Array.from({ length: Math.ceil(articlesResponse.data.length / itemsPerPage) }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 border rounded-md text-sm ${currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-700"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                disabled={currentPage >= Math.ceil(articlesResponse.data.length / itemsPerPage)}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {editingArticle ? "Edit Article" : "Add New Article"}
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} className="px-6 py-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={`shadow appearance-none border ${errors.title ? "border-red-500" : "border-gray-300"} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                    required
                                />
                                {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={`shadow appearance-none border ${errors.category ? "border-red-500" : "border-gray-300"} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {Object.values(Category).map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-red-500 text-xs italic mt-1">{errors.category}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                    Short Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className={`shadow appearance-none border ${errors.description ? "border-red-500" : "border-gray-300"} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                    rows={2}
                                    required
                                />
                                {errors.description && <p className="text-red-500 text-xs italic mt-1">{errors.description}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                                    Content
                                </label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    className={`shadow appearance-none border ${errors.content ? "border-red-500" : "border-gray-300"} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                    rows={6}
                                    required
                                />
                                {errors.content && <p className="text-red-500 text-xs italic mt-1">{errors.content}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Article Image</label>

                                <div className="mb-2">
                                    {imagePreview ? (
                                        <div className="relative w-full h-40 mb-2 border rounded-lg overflow-hidden">
                                            <img
                                                src={imagePreview || "/placeholder.svg"}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={clearImageUpload}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                title="Remove image"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-2">
                                            <Camera className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-1 text-sm text-gray-500">Upload article image</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="image-upload"
                                        className="flex items-center justify-center gap-2 cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-300 rounded px-4 py-2 transition-colors"
                                    >
                                        <Camera size={18} />
                                        <span>Upload from Computer</span>
                                        <input
                                            type="file"
                                            id="image-upload"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>

                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">OR</span>
                                        <div className="flex-1 h-px bg-gray-200"></div>
                                    </div>

                                    <div>
                                        <input
                                            type="url"
                                            id="imageUrl"
                                            name="imageUrl"
                                            value={formData.imageUrl}
                                            onChange={handleInputChange}
                                            placeholder="Enter image URL"
                                            className={`shadow appearance-none border ${errors.imageUrl ? "border-red-500" : "border-gray-300"} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                        />
                                    </div>
                                </div>

                                {errors.imageUrl && <p className="text-red-500 text-xs italic mt-1">{errors.imageUrl}</p>}
                                {errors.imageBase64 && <p className="text-red-500 text-xs italic mt-1">{errors.imageBase64}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
                                    Tags (comma separated)
                                </label>
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    value={formData.tags?.join(", ")}
                                    onChange={handleTagsChange}
                                    className={`shadow appearance-none border ${errors.tags ? "border-red-500" : "border-gray-300"} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                    placeholder="technology, news, trending"
                                />
                                {errors.tags && <p className="text-red-500 text-xs italic mt-1">{errors.tags}</p>}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating || isEditing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {(isCreating || isEditing) && <Loader size={16} className="animate-spin" />}
                                    {editingArticle ? "Update Article" : "Create Article"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isViewModalOpen && viewingArticle && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-900">Article Details</h3>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            {viewingArticle.imageUrl && (
                                <div className="mb-6">
                                    <img
                                        src={viewingArticle.imageUrl || "/placeholder.svg"}
                                        alt={viewingArticle.title}
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                </div>
                            )}

                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{viewingArticle.title}</h2>
                                <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                                        {viewingArticle.category}
                                    </span>
                                    <span>{new Date(viewingArticle.createdAt).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                        {viewingArticle.likes}
                                    </span>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                                    <p className="text-gray-700">{viewingArticle.description}</p>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-900 mb-2">Content</h3>
                                    <div className="prose max-w-none text-gray-700">{viewingArticle.content}</div>
                                </div>

                                {viewingArticle.tags && viewingArticle.tags.length > 0 && (
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {viewingArticle.tags.map((tag, index) => (
                                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-4 border-t">
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DashboardPage
