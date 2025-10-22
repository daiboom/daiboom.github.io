# Blog Posts

This directory contains blog post markdown files.

## File Structure

Each blog post should be a markdown file with frontmatter metadata:

```markdown
---
title: 'Post Title'
description: 'Post description'
author: 'daiboom'
date: '2024-01-25'
publishedAt: '2024-01-25'
updatedAt: '2024-01-25'
tags: ['tag1', 'tag2']
category: 'Programming'
slug: 'post-slug'
readTime: 5
featured: false
---

# Post Content

Your markdown content here...
```

## Usage

- Posts are automatically loaded from this directory
- Files should be named with the slug (e.g., `my-post-slug.md`)
- Frontmatter is required for proper parsing
- Content supports full markdown syntax including code blocks
