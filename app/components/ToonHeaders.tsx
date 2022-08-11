type Props = {
  className?: string;
  showMaxDifficulty?: boolean;
  showILevel?: boolean;
};
export default function ToonHeaderRow(props: Props) {
  const { className, showMaxDifficulty = false, showILevel = false } = props;
  return (
    <div className={`toon ${className}`}>
      <div className="toon-name">
        <strong>Name</strong>
      </div>
      <div className="toon-roles">
        <strong>Roles</strong>
      </div>
      {showMaxDifficulty && (
        <div className="toon-max-difficulty">
          <strong>Difficulty</strong>
        </div>
      )}
      {showILevel && (
        <div className="toon-ilevel">
          <strong>iLevel</strong>
        </div>
      )}
    </div>
  );
}
