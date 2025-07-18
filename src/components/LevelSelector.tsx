import {
  Select,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";

interface Props {
  selectedLevel?: string;
  onSelectLevel: (level: string) => void;
}

const LevelSelector = ({ selectedLevel, onSelectLevel }: Props) => {
  const levels = [
    { value: "", label: "All Levels" },
    { value: "regular", label: "Regular" },
    { value: "admin", label: "Admin" },
  ];

  return (
    <FormControl>
      <FormLabel>Level</FormLabel>
      <Select
        value={selectedLevel || ""}
        onChange={(event) => onSelectLevel(event.target.value)}
        placeholder="Select level"
      >
        {levels.map((level) => (
          <option key={level.value} value={level.value}>
            {level.label}
          </option>
        ))}
      </Select>
      <FormHelperText>Filter videos by level</FormHelperText>
    </FormControl>
  );
};

export default LevelSelector;
