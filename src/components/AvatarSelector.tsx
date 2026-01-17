import { useState } from "react";
import { X, Upload, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import femaleAvatar from "figma:asset/1f21835aef261596edd4a071395aa54fec27f0ec.png";
import maleAvatar from "figma:asset/d45279d0d3190d4d628d3a08758f90d7d9e5d466.png";
import { toast } from "sonner@2.0.3";

interface AvatarSelectorProps {
  currentAvatar: string;
  onSelect: (avatar: string) => void;
  onClose: () => void;
}

const DEFAULT_AVATARS = [
  { id: "female", name: "Female Avatar", image: femaleAvatar },
  { id: "male", name: "Male Avatar", image: maleAvatar },
];

export default function AvatarSelector({ currentAvatar, onSelect, onClose }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [customImage, setCustomImage] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setCustomImage(imageUrl);
        setSelectedAvatar(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedAvatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#2d2438] rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-100 to-purple-50 dark:from-[#3d2f52] dark:to-[#2d2438] px-6 py-4 rounded-t-3xl flex items-center justify-between">
          <h3 className="text-purple-900 dark:text-purple-200">Choose Your Avatar</h3>
          <button
            onClick={onClose}
            className="hover:bg-purple-200 dark:hover:bg-purple-900/30 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5 text-purple-900 dark:text-purple-200" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Default Avatars */}
          <div>
            <Label className="text-purple-900 dark:text-purple-200 mb-3 block">
              Default Avatars
            </Label>
            <div className="grid grid-cols-2 gap-4">
              {DEFAULT_AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.image)}
                  className={`relative rounded-2xl p-4 border-2 transition-all ${
                    selectedAvatar === avatar.image
                      ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                      : "border-purple-200 dark:border-purple-700/30 hover:border-purple-400"
                  }`}
                >
                  <img
                    src={avatar.image}
                    alt={avatar.name}
                    className="w-full h-auto rounded-xl"
                  />
                  {selectedAvatar === avatar.image && (
                    <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <p className="mt-2 text-purple-900 dark:text-purple-200 text-center">
                    {avatar.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Upload */}
          <div>
            <Label className="text-purple-900 dark:text-purple-200 mb-3 block">
              Upload Custom Image
            </Label>
            <label
              htmlFor="avatar-upload"
              className="block cursor-pointer"
            >
              <div
                className={`border-2 border-dashed rounded-2xl p-6 transition-all ${
                  customImage
                    ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                    : "border-purple-300 dark:border-purple-700/50 hover:border-purple-400"
                }`}
              >
                {customImage ? (
                  <div className="relative">
                    <img
                      src={customImage}
                      alt="Custom avatar"
                      className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-purple-300"
                    />
                    {selectedAvatar === customImage && (
                      <div className="absolute top-0 right-1/2 translate-x-1/2 bg-purple-600 rounded-full p-2">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-purple-900 dark:text-purple-200">
                        Click to upload
                      </p>
                      <p className="text-purple-600 dark:text-purple-400">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {customImage && (
              <button
                onClick={() => setSelectedAvatar(customImage)}
                className={`w-full mt-3 px-4 py-2 rounded-xl transition-colors ${
                  selectedAvatar === customImage
                    ? "bg-purple-600 text-white"
                    : "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-200 hover:bg-purple-200"
                }`}
              >
                {selectedAvatar === customImage ? "✓ Selected" : "Use This Image"}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-[#2d2438] px-6 py-4 rounded-b-3xl border-t border-purple-200 dark:border-purple-700/30 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
