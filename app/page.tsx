"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/react";
import { cn } from "@heroui/theme";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

import { title } from "@/components/primitives";

// Define the type for your form inputs
type Inputs = {
  file: FileList;
};

export default function Home() {
  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<Inputs>({ mode: "onChange" });

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const uploadTextRef = useRef<HTMLParagraphElement>(null);
  const allowedTypesTextRef = useRef<HTMLParagraphElement>(null);
  const fileNameTextRef = useRef<HTMLParagraphElement>(null);

  const watchedFile = watch("file");

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const selectedFile = data.file[0];

    if (selectedFile) {
      // console.log("File submitted:", selectedFile.name, selectedFile);
      // Example: Send to chess automation backend
      // const formData = new FormData();
      // formData.append("file", selectedFile);
      // fetch("/api/chess/analyze", { method: "POST", body: formData });
    } else {
      // console.log("No file selected.");
    }
  };

  // Effect to generate image preview URL and handle animations
  useEffect(() => {
    // console.log("errors", errors.file);
    if (watchedFile && watchedFile.length > 0) {
      const file = watchedFile[0];
      const reader = new FileReader();

      clearErrors("file");
      // console.log("errors", errors.file);

      reader.onloadend = () => {
        const newUrl = reader.result as string;

        setImagePreviewUrl(newUrl);

        // Animate elements with null checks
        setTimeout(() => {
          if (imageRef.current) {
            gsap.fromTo(
              imageRef.current,
              { scale: 0, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
            );
          }

          // Filter out null refs to prevent GSAP errors
          const elementsToAnimate = [
            iconRef.current,
            uploadTextRef.current,
            allowedTypesTextRef.current,
            fileNameTextRef.current,
          ].filter(
            (el): el is HTMLParagraphElement | SVGSVGElement => el !== null,
          );

          const tl = gsap.timeline();

          tl.to(elementsToAnimate, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            display: "none",
            stagger: 0.05,
          }).to(
            [allowedTypesTextRef.current, fileNameTextRef.current].filter(
              (el): el is HTMLParagraphElement => el !== null,
            ),
            {
              y: 0,
              opacity: 1,
              duration: 0.3,
            },
          );
        }, 50);
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      // Clear preview and animate image out
      if (imagePreviewUrl && imageRef.current) {
        gsap.to(imageRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          onComplete: () => setImagePreviewUrl(null),
        });
      } else {
        setImagePreviewUrl(null);
      }

      // Animate original elements back in
      const elementsToAnimate = [
        iconRef.current,
        uploadTextRef.current,
        allowedTypesTextRef.current,
      ].filter((el): el is HTMLParagraphElement | SVGSVGElement => el !== null);

      gsap.fromTo(
        elementsToAnimate,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          delay: 0.5,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.out",
          onStart: () => {
            elementsToAnimate.forEach((el) => (el.style.display = "block"));
          },
        },
      );
    }
  }, [watchedFile]);

  useEffect(() => {
    const elementsToAnimate = [errorRef.current].filter(
      (el): el is HTMLParagraphElement => el !== null,
    );

    if (Boolean(errors?.file?.message)) {
      gsap.fromTo(
        elementsToAnimate,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.in",
          // onStart: () => {
          //   elementsToAnimate.forEach((el) => (el.style.display = "block"));
          // },
        },
      );
    } else {
      gsap.fromTo(
        elementsToAnimate,
        {
          opacity: 1,
          y: 0,
        },
        {
          opacity: 0,
          y: 20,
          duration: 0.3,
          stagger: 0.5,
          ease: "power2.out",
        },
      );
    }
  }, [errors]);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="max-w-3xl mx-auto text-center">
        <span className={title()}>Convert Chessboard Images to</span>
        <span className={title({ color: "violet" })}> FEN</span>
        <div className={cn({ class: "mt-4" })}>
          Upload the chessboard image below to get started
        </div>
      </div>

      <Form
        className="mt-8 flex flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label
          className={cn(
            "!min-w-64 bg-transparent text-foreground-700 font-semibold text-base rounded-medium max-w-md h-52 flex flex-col items-center transition-all duration-1000 justify-center ease-in-out cursor-pointer border-2 border-foreground-300 border-dashed mx-auto overflow-hidden relative",
            { "border-red-500": errors.file },
          )}
          htmlFor="fileInput"
        >
          {imagePreviewUrl && (
            <Image
              ref={imageRef}
              alt="Chessboard preview"
              className="absolute inset-0 w-full h-full object-contain rounded-medium"
              height={256}
              src={imagePreviewUrl}
              style={{ opacity: 0, transform: "scale(0)" }}
              width={256}
            />
          )}
          <>
            <svg
              ref={iconRef}
              className="w-11 mb-3 fill-gray-500"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                data-original="#000000"
              />
              <path
                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                data-original="#000000"
              />
            </svg>
            <p ref={uploadTextRef}>Upload Chessboard Image</p>
          </>

          <input
            accept="image/png, image/jpeg"
            className="hidden"
            id="fileInput"
            type="file"
            {...register("file", {
              required: "Image is required",
              validate: {
                fileType: (value) => {
                  if (value && value[0]) {
                    const file = value[0];
                    const allowedTypes = ["image/png", "image/jpeg"];

                    if (!allowedTypes.includes(file.type)) {
                      return "Only PNG and JPG images are allowed.";
                    }
                  }

                  return true;
                },
                fileSize: (value) => {
                  if (value && value[0]) {
                    const file = value[0];
                    const maxSizeMb = 5;

                    if (file.size > maxSizeMb * 1024 * 1024) {
                      return `File size exceeds ${maxSizeMb}MB.`;
                    }
                  }

                  return true;
                },
              },
            })}
          />
          {!watchedFile?.length && (
            <p
              ref={allowedTypesTextRef}
              className="text-xs w-full !min-w-64 text-center font-medium text-slate-400 mt-2 z-10 p-1 rounded-sm"
            >
              PNG and JPG format images only.
            </p>
          )}

          <p
            ref={errorRef}
            className="text-xs w-full !min-w-64 text-center font-medium text-red-500 mt-2 z-10 p-1 rounded-sm"
          >
            {errors?.file?.message}
          </p>
        </label>

        <Button className="w-full" type="submit">
          Run Magic
        </Button>
      </Form>
    </section>
  );
}
