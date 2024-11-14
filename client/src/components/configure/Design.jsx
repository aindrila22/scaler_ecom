import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AspectRatio } from "../ui/aspect-ratio";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Steps from "../Steps";
import { backendUrl, cn, formatPrice } from "@/lib/utils";
import { Rnd } from "react-rnd";
import { ScrollArea } from "../ui/scroll-area";
import { RadioGroup } from "@headlessui/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import { Label } from "../ui/label";
import HandleComponent from "../HandleComponent";
import {
  BASE_PRICE,
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/lib/validators";
import { toast } from "@/hooks/use-toast";

const Design = () => {
  const { id } = useParams();
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const phoneCaseRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [options, setOptions] = useState({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/file/image/${id}`);
        setImageData(response.data);
      } catch (err) {
        console.error("Error fetching image data:", err);
        setError("Failed to load image data.");
      } finally {
        setLoading(false);
      }
    };

    fetchImageData();
  }, [id]);
  //  console.log("imageData ", imageData);
  const [renderedDimension, setRenderedDimension] = useState({
    width: imageData && imageData.width / 4,
    height: imageData && imageData.height / 4,
  });

  const [renderedPosition, setRenderedPosition] = useState({
    x: 150,
    y: 205,
  });

  async function saveConfig({ model, color, finish, material }) {
    try {
      setIsPending(true);
      const {
        left: caseLeft,
        top: caseTop,
        width,
        height,
      } = phoneCaseRef.current.getBoundingClientRect();

      const { left: containerLeft, top: containerTop } =
        containerRef.current.getBoundingClientRect();

      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;

      const actualX = renderedPosition.x - leftOffset;
      const actualY = renderedPosition.y - topOffset;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      const userImage = new Image();
      userImage.crossOrigin = "anonymous";
      userImage.src = imageData.url;
      await new Promise((resolve) => (userImage.onload = resolve));

      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimension.width,
        renderedDimension.height
      );

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];

      const blob = base64ToBlob(base64Data, "image/png");
      const file = new File([blob], "filename.png", { type: "image/png" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("color", color);
      formData.append("finish", finish);
      formData.append("material", material);
      formData.append("model", model);

      const response = await fetch(`${backendUrl}/file/preview/${id}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload configuration");
      }

      const responseData = await response.json();
      // console.log("resized data", responseData);
      if (responseData.success) {
        navigate(`/configure/preview/${id}`);
        toast({
          title: `Image uploaded successfully!`,
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Something went wrong",
        description:
          "There was a problem saving your config, please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  }

  function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  if (loading) {
    return (
      <MaxWidthWrapper>
      <div className="my-40 flex justify-center items-center w-full mx-auto">
        <iframe className="w-80 h-80" src="/animation.json"></iframe>
      </div>
    </MaxWidthWrapper>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <MaxWidthWrapper className="flex-1 flex flex-col">
      <Steps />
      <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20">
        <div
          ref={containerRef}
          className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
            <AspectRatio
              ref={phoneCaseRef}
              ratio={896 / 1831}
              className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
            >
              <img
                alt="phoneimage"
                src="/phone-template.png"
                className="pointer-events-none z-50 select-none"
              />
            </AspectRatio>
            <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
            <div
              className={cn(
                `absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] ${options.color.tw}`
              )}
            />
          </div>

          <Rnd
            default={{
              x: 150,
              y: 205,
              height: imageData && imageData.height / 4,
              width: imageData && imageData.width / 4,
            }}
            onResizeStop={(_, __, ref, ___, { x, y }) => {
              setRenderedDimension({
                height: parseInt(ref.style.height.slice(0, -2)),
                width: parseInt(ref.style.width.slice(0, -2)),
              });

              setRenderedPosition({ x, y });
            }}
            onDragStop={(_, data) => {
              const { x, y } = data;
              setRenderedPosition({ x, y });
            }}
            className="absolute z-20 border-[3px] border-primary"
            lockAspectRatio
            resizeHandleComponent={{
              bottomRight: <HandleComponent />,
              bottomLeft: <HandleComponent />,
              topRight: <HandleComponent />,
              topLeft: <HandleComponent />,
            }}
          >
            <div className="relative w-full h-full">
              {imageData && (
                <img
                  src={imageData.url}
                  //fill
                  alt="yourimage"
                  className="pointer-events-none"
                />
              )}
            </div>
          </Rnd>
        </div>

        <div className="h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white">
          <ScrollArea className="relative flex-1 overflow-auto">
            <div
              aria-hidden="true"
              className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
            />

            <div className="px-8 pb-12 pt-8">
              <h2 className="tracking-tight font-bold text-3xl">
                Customize your case
              </h2>

              <div className="w-full h-px bg-zinc-200 my-6" />

              <div className="relative mt-4 h-full flex flex-col justify-between">
                <div className="flex flex-col gap-6">
                  <RadioGroup
                    value={options.color}
                    onChange={(val) => {
                      setOptions((prev) => ({
                        ...prev,
                        color: val,
                      }));
                    }}
                  >
                    <Label>Color: {options.color.label}</Label>
                    <div className="mt-3 flex items-center space-x-3">
                      {COLORS.map((color) => (
                        <RadioGroup.Option
                          key={color.label}
                          value={color}
                          className={({ active, checked }) =>
                            cn(
                              "relative border-white -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent",
                              {
                                [`${color.tw}`]: active || checked,
                              }
                            )
                          }
                        >
                          <span
                            className={cn(
                              `${color.tw}`,
                              "h-8 w-8 rounded-full border border-black border-opacity-10"
                            )}
                          />
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>

                  <div className="relative flex flex-col gap-3 w-full">
                    <Label>Model</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {options.model.label}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {MODELS.options.map((model) => (
                          <DropdownMenuItem
                            key={model.label}
                            className={cn(
                              "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100",
                              {
                                "bg-zinc-100":
                                  model.label === options.model.label,
                              }
                            )}
                            onClick={() => {
                              setOptions((prev) => ({ ...prev, model }));
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                model.label === options.model.label
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {model.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {[MATERIALS, FINISHES].map(
                    ({ name, options: selectableOptions }) => (
                      <RadioGroup
                        key={name}
                        value={options[name]}
                        onChange={(val) => {
                          setOptions((prev) => ({
                            ...prev,
                            [name]: val,
                          }));
                        }}
                      >
                        <Label>
                          {name.slice(0, 1).toUpperCase() + name.slice(1)}
                        </Label>
                        <div className="mt-3 space-y-4">
                          {selectableOptions.map((option) => (
                            <RadioGroup.Option
                              key={option.value}
                              value={option}
                              className={({ active, checked }) =>
                                cn(
                                  "relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between",
                                  {
                                    "border-primary": active || checked,
                                  }
                                )
                              }
                            >
                              <span className="flex items-center">
                                <span className="flex flex-col text-sm">
                                  <RadioGroup.Label
                                    className="font-medium text-gray-900"
                                    as="span"
                                  >
                                    {option.label}
                                  </RadioGroup.Label>

                                  {option.description ? (
                                    <RadioGroup.Description
                                      as="span"
                                      className="text-gray-500"
                                    >
                                      <span className="block sm:inline">
                                        {option.description}
                                      </span>
                                    </RadioGroup.Description>
                                  ) : null}
                                </span>
                              </span>

                              <RadioGroup.Description
                                as="span"
                                className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                              >
                                <span className="font-medium text-gray-900">
                                  {formatPrice(option.price / 100)}
                                </span>
                              </RadioGroup.Description>
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                    )
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="w-full px-8 h-16 bg-white">
            <div className="h-px w-full bg-zinc-200" />
            <div className="w-full h-full flex justify-end items-center">
              <div className="w-full flex gap-6 items-center">
                <p className="font-medium whitespace-nowrap">
                  {formatPrice(
                    (BASE_PRICE +
                      options.finish.price +
                      options.material.price) /
                      100
                  )}
                </p>
                <Button
                  isLoading={isPending}
                  disabled={isPending}
                  loadingText="Saving"
                  onClick={() =>
                    saveConfig({
                      color: options.color.value,
                      finish: options.finish.value,
                      material: options.material.value,
                      model: options.model.value,
                    })
                  }
                  size="sm"
                  className="w-full"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-1.5 inline" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Design;
