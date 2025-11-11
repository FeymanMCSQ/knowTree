/** Stable child id: parent::type::title */
export function childId(
  parentId: string,
  type: 'prereq' | 'sub',
  title: string
) {
  return `${parentId}::${type}::${title}`;
}
