import sys

with open("src/pages/Services.tsx", "r") as f:
    content = f.read()

click_old = """                onClick={() => setSearch(s)}"""
click_new = """                onClick={() => {
                  setSearch(s);
                  saveRecentSearch(s);
                }}"""

content = content.replace(click_old, click_new)

with open("src/pages/Services.tsx", "w") as f:
    f.write(content)

