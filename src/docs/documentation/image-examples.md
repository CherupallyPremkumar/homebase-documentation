---
title: Image Examples
category: documentation
order: 2
---

# Adding Images to Documentation

This guide shows you how to add images to your markdown documentation.

## Method 1: External URLs

You can use any publicly accessible image URL:

![Sample Image](https://via.placeholder.com/600x300/2ECC71/FFFFFF?text=GeeksforGeeks+Style+Image)

## Method 2: GitHub-Hosted Images

Store images in your repository under `public/images/`:

```markdown
![My Diagram](/public/images/my-diagram.png)
```

## Method 3: Mermaid Diagrams

For technical diagrams, you can use Mermaid (coming soon):

```mermaid
graph LR
    A[User] --> B[Web App]
    B --> C[GitHub API]
    C --> D[Repository]
```

## Method 4: PlantUML Diagrams

For UML diagrams, use PlantUML (already supported):

```plantuml
@startuml
actor User
participant App
database GitHub

User -> App: Upload Image
App -> GitHub: Store File
GitHub -> App: Return URL
App -> User: Show Image
@enduml
```

## Best Practices

**Pros:**
- Use descriptive alt text for accessibility
- Optimize images for web (compress them)
- Use appropriate image formats (PNG for diagrams, JPG for photos)
- Store images in a dedicated folder

**Cons to Avoid:**
- Don't use very large images (slow loading)
- Don't use copyrighted images without permission
- Don't forget alt text
- Don't use absolute local paths

## Image Sizing

You can control image size using HTML in markdown:

```html
<img src="https://via.placeholder.com/400x200" alt="Small Image" width="400">
```

<img src="https://via.placeholder.com/400x200/27AE60/FFFFFF?text=Resized+Image" alt="Small Image" width="400">
