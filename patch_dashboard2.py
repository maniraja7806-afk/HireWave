import sys

with open("src/pages/Dashboard.tsx", "r") as f:
    content = f.read()

content = content.replace("import { getCategoryIcon } from '../utils/categoryIcons';", "import { getCategoryIcon } from './Services';")

with open("src/pages/Dashboard.tsx", "w") as f:
    f.write(content)
