with open("src/index.css", "w") as f:
    f.write("""@import "tailwindcss";
@custom-variant dark (&:is(.dark *));

html, body {
  @apply bg-slate-50 dark:bg-slate-900;
}

/* Hide default browser password reveal buttons */
input::-ms-reveal,
input::-ms-clear {
  display: none;
}

input::-webkit-credentials-auto-fill-button {
  visibility: hidden;
  position: absolute;
  right: 0;
}

@media (max-width: 768px) {
  .scrollbar-hide::-webkit-scrollbar { display: none; } 
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
}
""")
print("Done")
