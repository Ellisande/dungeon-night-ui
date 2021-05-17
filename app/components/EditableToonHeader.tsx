type Props = {
  className?: string;
};

export default function EditableToonHeaderRow(props: Props) {
  const { className } = props;

  return (
    <div className="toon-edit-layout header">
      <div className={`toon-editable ${className}`}>
        <strong className="toon-name">Name</strong>
        <strong className="roles-header">Roles</strong>

        <strong className="ilevel-header">iLvl</strong>
        <strong className="difficulty-header">Difficulty</strong>
        <strong>Save</strong>
      </div>
      <strong>LFG</strong>
    </div>
  );
}
