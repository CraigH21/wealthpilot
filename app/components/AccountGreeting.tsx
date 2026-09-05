type AccountGreetingProps = {
  name?: string;
};

export default function AccountGreeting({ name = "Craig" }: AccountGreetingProps) {
  return (
    <div className="hidden text-right sm:block">
      <p className="text-xs text-zinc-900">Good to see you,</p>
      <p className="text-sm font-medium text-accent transition-colors duration-500 ease-out">
        {name}
      </p>
    </div>
  );
}
