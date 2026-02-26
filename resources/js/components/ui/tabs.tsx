import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { defaultValue?: string; value?: string; onValueChange?: (value: string) => void }
>(({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || "")

    React.useEffect(() => {
        if (value !== undefined) {
            setSelectedValue(value)
        }
    }, [value])

    const handleValueChange = (newValue: string) => {
        if (value === undefined) {
            setSelectedValue(newValue)
        }
        onValueChange?.(newValue)
    }

    return (
        <div
            ref={ref}
            data-value={selectedValue}
            className={cn("w-full", className)}
            {...props}
        >
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, { selectedValue, onValueChange: handleValueChange } as any)
                }
                return child
            })}
        </div>
    )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { selectedValue?: string; onValueChange?: (value: string) => void }
>(({ className, children, selectedValue, onValueChange, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-9 items-center justify-start rounded-none border-b bg-transparent p-0 text-muted-foreground w-full",
            className
        )}
        {...props}
    >
        {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { selectedValue, onClick: () => onValueChange?.(child.props.value) } as any)
            }
            return child
        })}
    </div>
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string; selectedValue?: string }
>(({ className, value, selectedValue, ...props }, ref) => (
    <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={selectedValue === value}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap py-2 px-4 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none relative",
            selectedValue === value && "border-primary text-foreground pointer-events-none",
            className
        )}
        {...props}
    />
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string; selectedValue?: string }
>(({ className, value, selectedValue, ...props }, ref) => {
    if (value !== selectedValue) return null
    return (
        <div
            ref={ref}
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            {...props}
        />
    )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
