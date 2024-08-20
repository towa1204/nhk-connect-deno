export default function SaveButton({
  isDisabled,
  onClickLogic
}: {
  isDisabled: boolean
  onClickLogic: () => void
}) {
  return (
    <button
      type="button"
      className={`h-8 whitespace-nowrap rounded-md border px-3.5 leading-none transition-colors duration-150 ease-in-out ${
        isDisabled
          ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500' // 無効な時のスタイル
          : 'cursor-pointer border-gray-200 bg-blue-700 text-white hover:border-gray-300 hover:bg-blue-800' // 有効な時のスタイル
      }`}
      onClick={onClickLogic}
      disabled={isDisabled}
    >
      Save
    </button>
  )
}
