type Props = {
  difficulty: number;
};
export default function Difficulty(props: Props) {
  const { difficulty } = props;
  let style = "normal";
  style = difficulty >= 15 ? "legendary" : "mythic";
  return <div className={`difficulty ${style}`}>+{difficulty}</div>;
}
