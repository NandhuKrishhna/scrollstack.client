export interface Author {
    _id: string
    name: string
    profilePicture: string
}

export interface Article {
    _id: string
    title: string
    content: string
    description: string
    category: string
    imageUrl: string
    author: Author
    createdAt: Date
    likes: number
    likedBy: string[]
    tags: string[]
}
