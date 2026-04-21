import { Button } from "./ui/button";

export function SubmitButtons({
                                  onCreate,
                                  onCreateAndConduct,
                                  disabled,
                              }: {
    onCreate: () => void;
    onCreateAndConduct: () => void;
    disabled: boolean;
}) {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-2 max-w-md mx-auto">
            <Button variant="outline" onClick={onCreate} disabled={disabled} className="flex-1">
                Создать продажу
            </Button>
            <Button onClick={onCreateAndConduct} disabled={disabled} className="flex-1">
                Создать и провести
            </Button>
        </div>
    );
}
