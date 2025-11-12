
export abstract class JoyItem {
  // A giving/lending item will contain an image, title, description
  imageUrl: string
  title: string
  description: string
  creation_date: Date = new Date()
  constructor(imageUrl: string, title: string, description: string) {
    this.imageUrl = imageUrl
    this.title = title
    this.description = description
  }
}