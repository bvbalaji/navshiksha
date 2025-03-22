"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { File, Download, X, Image, FileVideo, FileIcon as FilePdf } from "lucide-react"

type FilePreviewProps = {
  file: {
    name: string
    type: string
    size: number
    url: string
  }
  onClose: () => void
}

export default function FilePreview({ file, onClose }: FilePreviewProps) {
  const [isLoading, setIsLoading] = useState(true)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const getFileIcon = () => {
    if (file.type.startsWith("image/")) return <Image className="h-8 w-8 text-blue-500" />
    if (file.type.startsWith("video/")) return <FileVideo className="h-8 w-8 text-purple-500" />
    if (file.type === "application/pdf") return <FilePdf className="h-8 w-8 text-red-500" />
    return <File className="h-8 w-8 text-gray-500" />
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{file.name}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center">
          {file.type.startsWith("image/") ? (
            <div className="relative min-h-[200px] w-full">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm text-gray-500">Loading image...</span>
                </div>
              )}
              <img
                src={file.url || "/placeholder.svg"}
                alt={file.name}
                className="mx-auto max-h-[400px] object-contain"
                onLoad={handleLoad}
              />
            </div>
          ) : file.type.startsWith("video/") ? (
            <video src={file.url} controls className="max-h-[400px] w-full" onLoadedData={handleLoad} />
          ) : file.type === "application/pdf" ? (
            <iframe src={file.url} title={file.name} className="h-[400px] w-full" onLoad={handleLoad} />
          ) : (
            <div className="flex h-[200px] flex-col items-center justify-center">
              {getFileIcon()}
              <p className="mt-4 text-center text-sm text-gray-500">Preview not available for this file type</p>
            </div>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>File size: {formatFileSize(file.size)}</p>
          <p>File type: {file.type}</p>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button asChild>
          <a href={file.url} download={file.name}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

