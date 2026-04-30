"use client";

import React, { useState, useRef, ReactNode } from "react";
import { Upload, X } from "lucide-react";

interface FileUploaderProps {
    onFilesSelected?: (files: File[]) => void;
    acceptedFileTypes?: string;
    maxFileSize?: number;
    width?: string;
    height?: string;
    uploadText?: string;
    dragActiveText?: string;
    children?: ReactNode;
    className?: string;
}

export default function FileUploader({
    onFilesSelected,
    acceptedFileTypes = ".duckdb",
    maxFileSize = 50 * 1024 * 1024,
    width = "w-full",
    height = "h-40",
    uploadText = "Drag and drop your files here, or click to select",
    dragActiveText = "Drop your files here",
    children,
    className = "",
}: FileUploaderProps) {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const validateFiles = (filesToValidate: File[]): boolean => {
        for (const file of filesToValidate) {
            if (maxFileSize && file.size > maxFileSize) {
                setError(
                    `File "${file.name}" exceeds maximum size of ${(maxFileSize / 1024 / 1024).toFixed(2)}MB`
                );
                return false;
            }
        }
        setError(null);
        return true;
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0 && validateFiles([droppedFiles[0]])) {
            const singleFile = [droppedFiles[0]];
            setFiles(singleFile);
            onFilesSelected?.(singleFile);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length > 0 && validateFiles([selectedFiles[0]])) {
            const singleFile = [selectedFiles[0]];
            setFiles(singleFile);
            onFilesSelected?.(singleFile);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const removeFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onFilesSelected?.(updatedFiles);
    };

    return (
        <div className={`${className}`}>
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleClick}
                className={`
          ${width} ${height}
          border-2 border-dashed rounded-lg
          transition-all duration-200 cursor-pointer
          flex flex-col items-center justify-center gap-3
          ${dragActive
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-900/30"
                    }
        `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    onChange={handleChange}
                    accept={acceptedFileTypes}
                    className="hidden"
                />

                {files.length === 0 ? (
                    <>
                        <Upload
                            className={`w-8 h-8 ${dragActive ? "text-blue-500" : "text-gray-400"}`}
                        />
                        <div className="text-center">
                            <p
                                className={`text-sm font-medium ${dragActive
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-600 dark:text-gray-400"
                                    }`}
                            >
                                {dragActive ? dragActiveText : uploadText}
                            </p>
                            {maxFileSize && (
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    Max file size: {(maxFileSize / 1024 / 1024).toFixed(2)}MB
                                </p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full overflow-y-auto p-4">
                        <div className="space-y-2">
                            {files.map((file, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(index);
                                        }}
                                        className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                    >
                                        <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {children}
            </div>

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
            )}
        </div>
    );
}
