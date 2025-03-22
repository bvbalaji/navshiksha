"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { File, X, Image, FileVideo, FileIcon as FilePdf, Check, Eye } from "lucide-react"

type FileItemProps = {
  file: {
    id: number
    name: string
    size: number
    type: string
    progress: number
    status: "uploading" | "complete" | "error"
  }
  onRemove: (id: number) => void
  onPreview: (id: number) => void
}

export default function FileItem({ file, onRemove, onPreview }: FileItemProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const getFileIcon = () => {
    if (file.type.startsWith("image/")) return <Image className="h-5 w-5 text-blue-500" />
    if (file.type.startsWith("video/")) return <FileVideo className="h-5 w-5 text-purple-500" />
    if (file.type === "application/pdf") return <FilePdf className="h-5 w-5 text-red-500" />
    return <File className="h-5 w-5 text-gray-500" />
  }

  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getFileIcon()}
          <div>
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {file.status === "complete" && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onPreview(file.id)}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600"
            onClick={() => onRemove(file.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {file.status === "uploading" && (
        <div className="mt-2">
          <Progress value={file.progress} className="h-1" />
          <p className="mt-1 text-xs text-gray-500">Uploading... {file.progress}%</p>
        </div>
      )}
      {file.status === "complete" && (
        <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
          <Check className="h-3 w-3" />
          <span>Upload complete</span>
        </div>
      )}
    </div>
  )
}

