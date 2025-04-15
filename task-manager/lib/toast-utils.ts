import { toast } from "sonner"

// This utility helps migrate from shadcn/ui toast to sonner
export const useToast = () => {
  return {
    toast: {
      // Map shadcn/ui toast variants to sonner
      success: (options: { title?: string; description?: string }) => 
        toast.success(options.title, { description: options.description }),
      error: (options: { title?: string; description?: string }) =>
        toast.error(options.title, { description: options.description }),
      // Default toast\
      (...args: Parameters<typeof toast>) {
        return toast(...args);
      },
    }
  }
}
