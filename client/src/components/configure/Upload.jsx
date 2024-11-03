import { Image, Loader2 } from "lucide-react";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { Progress } from "../ui/progress";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Steps from "../Steps";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { backendUrl, cn } from "@/lib/utils";

const Upload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const handleUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${backendUrl}/file/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentComplete = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(percentComplete);
          },
        }
      );

      if (response.data.success) {
        navigate(`/configure/design/${response.data.configId}`);
        toast({
          title: `Image uploaded successfully!`,
        });
      } else {
        toast({
          title: `Upload failed!`,
          description: `Please try again.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading the image:", error);
      setIsUploading(false);
      toast({
        title: `Error uploading the image.`,
        description: `Server error: ${
          error.response?.status || "Unknown error"
        }`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onDropRejected = (rejectedFiles) => {
    const [file] = rejectedFiles;
    setIsDragOver(false);
    toast({
      title: `${file.file.type} type is not supported.`,
      description: "Please choose a PNG, JPG, or JPEG image instead.",
      variant: "destructive",
    });
  };

  const onDropAccepted = (acceptedFiles) => {
    handleUpload(acceptedFiles[0]);
    setIsDragOver(false);
  };

  return (
    <MaxWidthWrapper className="flex-1 flex flex-col">
      <Steps />
      <div
        className={cn(
          "relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center",
          {
            "ring-blue-900/25 bg-blue-900/10": isDragOver,
          }
        )}
      >
        <div className="relative flex flex-1 flex-col items-center justify-center w-full py-24">
          <Dropzone
            onDropRejected={onDropRejected}
            onDropAccepted={onDropAccepted}
            accept={{
              "image/png": [".png"],
              "image/jpeg": [".jpeg"],
              "image/jpg": [".jpg"],
            }}
            onDragEnter={() => setIsDragOver(true)}
            onDragLeave={() => setIsDragOver(false)}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="h-full w-full flex-1 flex flex-col items-center justify-center "
              >
                <input {...getInputProps()} />

                {isUploading ? (
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-zinc-500 mb-2" />
                    <p>Uploading...</p>
                    <Progress
                      value={uploadProgress}
                      className="mt-2 w-40 h-2 bg-gray-300"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Image className="h-6 w-6 text-zinc-500 mb-2" />
                    <p className="text-base text-zinc-900 pt-6 cursor-pointer">
                      {isDragOver
                        ? "Drop file here to upload"
                        : "Click or drag to upload"}
                    </p>
                  </div>
                )}
                <p className="text-xs text-zinc-500 pt-6">PNG, JPG, JPEG</p>
              </div>
            )}
          </Dropzone>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Upload;
