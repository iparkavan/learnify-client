This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# lms-frontend

# learnify-cli

<!-- Start work on the line number 342 in the edit-course.tsx file. Attach the reference code below -->

<!-- const { mutate: createSectionMutate } = useMutation({
  mutationFn: async ({
    tempId,
  }: {
    tempId: string;
  }) => {
    const data = await createSectionMutateFn({
      courseId,
      payload: {
        title: "Untitled Section",
      },
    });

    return {
      section: data.section, // real DB section from backend
      tempId, // frontend-only temp id
    };
  },

  onSuccess: ({ section, tempId }) => {
    // replace temp section with real DB section
    setSections((prev) =>
      prev.map((item) =>
        item.id === tempId
          ? {
              ...item,
              id: section.id,
              title: section.title,
              courseId: section.courseId,
              order: section.order,
            }
          : item
      )
    );

    // replace temp accordion id with real DB id
    setOpenAccordionSections((prev) =>
      prev.map((id) =>
        id === tempId ? section.id : id
      )
    );
  },

  onError: (_, variables) => {
    // rollback if API fails
    setSections((prev) =>
      prev.filter((item) => item.id !== variables.tempId)
    );

    setOpenAccordionSections((prev) =>
      prev.filter((id) => id !== variables.tempId)
    );
  },
});

const onAddSectionHandler = useCallback(() => {
  const tempId = generateId();

  const newSection: Section = {
    id: tempId,
    title: "Untitled Section",
    objective: "",
    lectures: [],
  };

  // instant UI update
  setSections((prev) => [...prev, newSection]);

  // open accordion immediately
  setOpenAccordionSections((prev) => [
    ...prev,
    tempId,
  ]);

  // backend API call
  createSectionMutate({
    tempId,
  });
}, [createSectionMutate]); -->
