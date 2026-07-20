export default function Container({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-w-[320px] max-w-[375px] mx-auto md:max-w-[768px] min-[1440px]:max-w-[1440px]">
      {children}
    </div>
  );
}