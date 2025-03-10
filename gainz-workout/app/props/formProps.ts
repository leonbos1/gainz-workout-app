export default interface FormProps {
    toggleFormVisibility: (formName: string | null) => void;
    fetchGraphs: () => void;
}