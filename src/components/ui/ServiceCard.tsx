import { forwardRef } from "react"

interface ServiceCardProps {
    label: string
    title: string
    description?: string
    variant?: "mobile" | "desktop"
    className?: string
}

const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(
    ({ label, title, description, variant = "desktop", className = "" }, ref) => {
        const isMobile = variant === "mobile"

        return (
            <div
                ref={ref}
                className={`text-white bg-opacity-50 rounded-lg ${
                    isMobile ? "w-full p-3" : "max-w-md p-4"
                } ${className}`}
            >
                <span
                    className={`text-gray-300 leading-relaxed ${
                        isMobile ? "text-xs mb-4" : "text-sm mb-6"
                    }`}
                >
                    {label}
                </span>
                {isMobile ? (
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">{title}</h3>
                    </div>
                ) : (
                    <>
                        <h3 className="text-3xl font-bold mb-4 pb-2 text-white border-b border-white">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-lg text-gray-300 leading-relaxed mb-6">
                                {description}
                            </p>
                        )}
                    </>
                )}
            </div>
        )
    }
)

ServiceCard.displayName = "ServiceCard"

export default ServiceCard
