// app/admin/login/layout.tsx
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Main login content */}
      {children}
      {/* Optional: Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; 2025 Red Zone. All rights reserved.
        </p>
      </div>
    </div>
  );
}
