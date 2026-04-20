import { Upload, X } from "lucide-react"
import { useState, useRef, useCallback, DragEvent, ChangeEvent } from "react"

interface ImageUploadProps {
    value: File | null
    onChange: (file: File | null) => void
}

const ImageUpload = ({ value, onChange }: ImageUploadProps) => {
    const [isDragging, setIsDragging] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Xử lý file sau khi chọn — dùng chung cho cả click và drop
    const processFile = useCallback((file: File) => {
        // Validate type
        if (!["image/png", "image/jpeg"].includes(file.type)) {
            alert("Only PNG and JPG are allowed")
            return
        }
        // Validate size (5MB = 5 * 1024 * 1024 bytes)
        if (file.size > 5 * 1024 * 1024) {
            alert("File size must be under 5MB")
            return
        }

        // createObjectURL tạo ra một URL tạm thời trỏ vào bộ nhớ
        // Hiệu quả hơn FileReader vì không cần decode base64
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)
        onChange(file)
    }, [onChange])

    // --- Drag & Drop handlers ---
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault() // BẮT BUỘC — nếu không preventDefault, onDrop sẽ không fire
        setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault() // Ngăn browser mở file trong tab mới
        setIsDragging(false)

        // e.dataTransfer.files là FileList, lấy file đầu tiên
        const file = e.dataTransfer.files[0]
        if (file) processFile(file)
    }

    // --- Click to open file picker ---
    const handleClick = () => {
        inputRef.current?.click()
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) processFile(file)
        // Reset input để cho phép chọn lại cùng 1 file
        e.target.value = ""
    }

    // --- Remove image ---
    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation() // Tránh trigger handleClick của parent div
        if (preview) URL.revokeObjectURL(preview) // Giải phóng bộ nhớ
        setPreview(null)
        onChange(null)
    }

    return (
        <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
        relative flex h-32 cursor-pointer flex-col items-center justify-center 
        rounded-md border-2 border-dashed transition-colors
        ${isDragging
                    ? "border-gold-primary bg-gold-subtle"
                    : "border-gold-border bg-gold-subtle/20 hover:border-gold-primary hover:bg-gold-subtle"
                }
      `}
        >
            {/* Hidden native input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleInputChange}
                className="hidden"
            />

            {preview ? (
                // Preview state
                <>
                    <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full rounded-md object-cover"
                    />
                    <button
                        onClick={handleRemove}
                        className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </>
            ) : (
                // Empty state
                <>
                    <Upload className={`mb-2 h-8 w-8 ${isDragging ? "text-gold-primary" : "text-muted-foreground"}`} />
                    <span className="text-sm text-muted-foreground">
                        {isDragging ? "Drop to upload" : "Click to upload or drag and drop"}
                    </span>
                    <span className="text-xs text-muted-foreground">PNG, JPG up to 5MB</span>
                </>
            )}
        </div>
    )
}

export default ImageUpload;