type Props = {
  difficulty: string;
};
export default function Difficulty(props: Props) {
  const { difficulty } = props;
  let style = "normal";
  if (difficulty == "heroic") {
    style = "heroic";
  }
  if (difficulty == "mythic") {
    style = "mythic";
  }
  if (/m\d+/.test(difficulty)) {
    const level = Number(difficulty.replace(/m/i, ""));
    style = level >= 10 ? "legendary" : "mythic";
  }
  return <div className={`difficulty ${style}`}>{difficulty}</div>;
}
