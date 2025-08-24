import ThemedText from "./themed-components/ThemedText";

const Label = ({ title, subTitle }: { title: string; subTitle?: string | undefined }) => {
  return (
    <>
      <ThemedText style={{ width: "80%", fontSize: 12 }}>{title}</ThemedText>
      <ThemedText style={{ width: "80%", fontSize: 12, color: "gray" }}>{subTitle}</ThemedText>
    </>
  );
};

export default Label;
