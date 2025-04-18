import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({
  // formControls,
  // formData,
  // setFormData,
  // onSubmit,
  // buttonText,
  // isBtnDisabled,
  formControls = [],
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled = false,
}) {
  function handleOnChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );

        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );

  // return (
  //   // Daha iyi dikey boşluk için space-y-6
  //   <form onSubmit={onSubmit} className="space-y-6">
  //     {/* Alanları grid içinde render et */}
  //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
  //       {" "}
  //       {/* Yatayda 4, dikeyde 6 boşluk */}
  //       {formControls.map((controlItem) => {
  //         // Textarea veya 'layout: full' olanlar 2 sütun kaplasın, diğerleri 1
  //         const colSpan =
  //           controlItem.componentType === "textarea" ||
  //           controlItem.layout === "full"
  //             ? "sm:col-span-2"
  //             : "sm:col-span-1";

  //         return (
  //           // Alan ve label'ı içeren div, sütun genişliğini uygula
  //           <div key={controlItem.name} className={`space-y-1.5 ${colSpan}`}>
  //             <Label
  //               htmlFor={controlItem.name}
  //               className="text-sm font-medium text-gray-800" // Label rengi biraz koyulaştırıldı
  //             >
  //               {controlItem.label}
  //             </Label>
  //             {controlItem.componentType === "textarea" ? (
  //               <Textarea
  //                 id={controlItem.name}
  //                 name={controlItem.name}
  //                 placeholder={controlItem.placeholder}
  //                 value={formData[controlItem.name]}
  //                 onChange={handleOnChange}
  //                 className="min-h-[80px] border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150" // Geçiş ve focus stili
  //                 rows={controlItem.rows || 3}
  //               />
  //             ) : (
  //               <Input
  //                 type={controlItem.type}
  //                 id={controlItem.name}
  //                 name={controlItem.name}
  //                 placeholder={controlItem.placeholder}
  //                 value={formData[controlItem.name]}
  //                 onChange={handleOnChange}
  //                 className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150" // Geçiş ve focus stili
  //               />
  //             )}
  //           </div>
  //         );
  //       })}
  //     </div>

  //     {/* Gönder Butonu */}
  //     <Button
  //       type="submit"
  //       disabled={isBtnDisabled}
  //       className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white font-semibold py-2.5 rounded-md shadow-md transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed" // Daha belirgin buton stili
  //     >
  //       {buttonText}
  //     </Button>
  //   </form>
  // );
}

export default CommonForm;
