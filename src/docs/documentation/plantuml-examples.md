---
title: PlantUML Diagram Example
category: documentation
order: 1
---

# PlantUML Diagram Support

This documentation viewer now supports PlantUML diagrams! You can create diagrams using code blocks with the `plantuml` or `uml` language identifier.

## Example: Simple Class Diagram

```plantuml
@startuml
class User {
  +String name
  +String email
  +login()
  +logout()
}

class Admin {
  +manageUsers()
  +viewLogs()
}

User <|-- Admin
@enduml
```

## Example: Sequence Diagram

```plantuml
@startuml
actor User
participant "Web App" as App
participant "GitHub API" as GitHub
database "Repository" as Repo

User -> App: Create Document
App -> GitHub: Authenticate
GitHub -> App: Token
App -> GitHub: Create File
GitHub -> Repo: Save File
Repo -> GitHub: Success
GitHub -> App: File Created
App -> User: Document Saved
@enduml
```

## Example: Component Diagram

```uml
@startuml
package "Frontend" {
  [React App]
  [DocumentViewer]
  [PlantUML Component]
}

package "Backend" {
  [GitHub API]
  [PlantUML Server]
}

database "GitHub Repository" {
  [Markdown Files]
}

[React App] --> [DocumentViewer]
[DocumentViewer] --> [PlantUML Component]
[PlantUML Component] --> [PlantUML Server]
[React App] --> [GitHub API]
[GitHub API] --> [Markdown Files]
@enduml
```

## How to Use

1. Create a code block with ` ```plantuml ` or ` ```uml `
2. Write your PlantUML code inside
3. The diagram will be automatically rendered!

## Supported Diagram Types

- Class Diagrams
- Sequence Diagrams
- Use Case Diagrams
- Activity Diagrams
- Component Diagrams
- State Diagrams
- Object Diagrams
- Deployment Diagrams
- Timing Diagrams
- And more!
