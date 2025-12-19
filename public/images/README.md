# Images Directory

Store your documentation images here.

## Recommended Structure

```
public/images/
├── architecture/
│   ├── system-diagram.png
│   └── component-diagram.png
├── screenshots/
│   ├── ui-example.png
│   └── workflow.png
└── logos/
    └── logo.png
```

## Usage in Markdown

Reference images using relative paths:

```markdown
![Architecture](../images/architecture/system-diagram.png)
```

Or absolute paths from public:

```markdown
![Architecture](/images/architecture/system-diagram.png)
```

## Image Guidelines

- **Format**: Use PNG for diagrams/screenshots, JPG for photos
- **Size**: Keep under 500KB per image
- **Dimensions**: Max 1200px width for best performance
- **Naming**: Use kebab-case (my-image-name.png)
