import { useParams } from "react-router-dom";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Steps from "../Steps";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_PRICE, COLORS, MODELS, PRODUCT_PRICES } from "@/lib/validators";
import { backendUrl, cn, formatPrice } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import Confetti from "react-dom-confetti";
import Phone from "../Phone";
import LoginModal from "../LoginModal";
import { useSelector } from "react-redux";
import { toast } from "@/hooks/use-toast";

const Preview = () => {
  const { id } = useParams();
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.user);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    //console.log("triggered");
    setShowConfetti(true);
  }, []);

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/file/preview/${id}`);
        setImageData(response.data);
      } catch (err) {
        console.error("Error fetching image data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImageData();
  }, [id]);

  //console.log(imageData);

  let tw = null;

  if (imageData && imageData.color) {
    const matchedColor = COLORS.find(
      (supportedColor) => supportedColor.value === imageData.color
    );
    tw = matchedColor ? matchedColor.tw : null;
  }

  const modelLabel = MODELS.options.find((value) => value === imageData.model);

  let totalPrice = BASE_PRICE;
  if (imageData.material === "polycarbonate")
    totalPrice += PRODUCT_PRICES.material.polycarbonate;
  if (imageData.finish === "textured")
    totalPrice += PRODUCT_PRICES.finish.textured;

  const handleCheckout = async () => {
    //console.log(userInfo);
    if (userInfo) {
      const orderDetails = {
        finish: imageData.finish,
        material: imageData.material,
        color: imageData.color,
        totalPrice,
        model: imageData.model,
        user: userInfo,
        imageUrl: imageData.resizedUrl,
      };

      try {
        const response = await axios.post(
          `${backendUrl}/api/checkout`,
          orderDetails
        );
        if (response.data.url) {
          window.location.href = response.data.url; // Redirect to Stripe
        }
      } catch (error) {
        console.error("Error during checkout:", error);
        toast({
          title: `Checkout failed`,
          description: `Server error: ${
            error.response?.status || "Unknown error"
          }`,
          variant: "destructive",
        });
      }
    } else {
      // need to log in
      localStorage.setItem("configurationId", id);
      setIsLoginModalOpen(true);
    }
  };

  const config = {
    angle: "124",
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  if (loading) {
    return (
      <MaxWidthWrapper>
      <div className="min-h-screen flex justify-center items-center w-full mx-auto">
      <Loader2 className="animate-spin h-6 w-6 lg:h-10 lg:w-10 text-zinc-500 mb-2" />
      </div>
    </MaxWidthWrapper>
    );
  }

  return (
    !loading && (
      <MaxWidthWrapper className="flex-1 flex flex-col">
        <Steps />
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
          >
            <Confetti active={showConfetti} config={config} />
          </div>

          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          />

          <div className="mt-20 flex flex-col items-center md:grid text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
            <div className="md:col-span-4 lg:col-span-3 md:row-span-2 md:row-end-2">
              <Phone
                className={cn(`${tw}`, "max-w-[150px] md:max-w-full")}
                imgSrc={imageData.resizedUrl}
              />
            </div>

            <div className="mt-6 sm:col-span-9 md:row-end-1">
              <h3 className="text-3xl font-bold tracking-tight text-gray-900">
                Your {modelLabel} Case
              </h3>
              <div className="mt-3 flex items-center gap-1.5 text-base">
                <Check className="h-4 w-4 text-[#9575cd]" />
                In stock and ready to ship
              </div>
            </div>

            <div className="sm:col-span-12 md:col-span-9 text-base">
              <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
                <div>
                  <p className="font-medium text-zinc-950">Highlights</p>
                  <ol className="mt-3 text-zinc-700 list-disc list-inside">
                    <li>Wireless charging compatible</li>
                    <li>TPU shock absorption</li>
                    <li>Packaging made from recycled materials</li>
                    <li>5 year print warranty</li>
                  </ol>
                </div>
                <div>
                  <p className="font-medium text-zinc-950">Materials</p>
                  <ol className="mt-3 text-zinc-700 list-disc list-inside">
                    <li>High-quality, durable material</li>
                    <li>Scratch- and fingerprint resistant coating</li>
                  </ol>
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
                  <div className="flow-root text-sm">
                    <div className="flex items-center justify-between py-1 mt-2">
                      <p className="text-gray-600">Base price</p>
                      <p className="font-medium text-gray-900">
                        {formatPrice(BASE_PRICE / 100)}
                      </p>
                    </div>

                    {imageData.finish === "textured" ? (
                      <div className="flex items-center justify-between py-1 mt-2">
                        <p className="text-gray-600">Textured finish</p>
                        <p className="font-medium text-gray-900">
                          {formatPrice(PRODUCT_PRICES.finish.textured / 100)}
                        </p>
                      </div>
                    ) : null}

                    {imageData.material === "polycarbonate" ? (
                      <div className="flex items-center justify-between py-1 mt-2">
                        <p className="text-gray-600">
                          Soft polycarbonate material
                        </p>
                        <p className="font-medium text-gray-900">
                          {formatPrice(
                            PRODUCT_PRICES.material.polycarbonate / 100
                          )}
                        </p>
                      </div>
                    ) : null}

                    <div className="my-2 h-px bg-gray-200" />

                    <div className="flex items-center justify-between py-2">
                      <p className="font-semibold text-gray-900">Order total</p>
                      <p className="font-semibold text-gray-900">
                        {formatPrice(totalPrice / 100)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end pb-12">
                  <Button
                    onClick={() => handleCheckout()}
                    className="px-4 sm:px-6 lg:px-8"
                  >
                    Checkout <ArrowRight className="h-4 w-4 ml-1.5 inline" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      </MaxWidthWrapper>
    )
  );
};

export default Preview;
