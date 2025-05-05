// import { filterOptions } from "@/config";
// import { Fragment } from "react";
// import PropTypes from "prop-types";
// import { Label } from "../ui/label";
// import { Checkbox } from "../ui/checkbox";
// import { Separator } from "../ui/separator";

// function ProductFilter({ filters, handleFilter }) {
//   return (
//     <div className="bg-background rounded-lg shadow-sm">
//       <div className="p-4 border-b">
//         <h2 className="text-lg font-extrabold">Filtre</h2>
//       </div>
//       <div className="p-4 flex flex-col max-[600px]:flex-row gap-14">
//         {Object.keys(filterOptions).map((keyItem) => (
//           <Fragment key={keyItem}>
//             <div className="mt-0">
//               <h3 className="text-base font-bold">{keyItem}</h3>
//               <div className="grid gap-2 mt-2">
//                 {filterOptions[keyItem].map((option) => (
//                   <Label
//                     key={option.id}
//                     className="flex font-medium items-center gap-2 "
//                   >
//                     <Checkbox
//                       checked={
//                         filters &&
//                         Object.keys(filters).length > 0 &&
//                         filters[keyItem] &&
//                         filters[keyItem].indexOf(option.id) > -1
//                       }
//                       onCheckedChange={() => handleFilter(keyItem, option.id)}
//                     />
//                     {option.label}
//                   </Label>
//                 ))}
//               </div>
//             </div>
//           </Fragment>
//         ))}
//       </div>
//     </div>
//   );
// }
// ProductFilter.propTypes = {
//   filters: PropTypes.objectOf(
//     PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
//   ),
//   handleFilter: PropTypes.func.isRequired,
// };

// export default ProductFilter;

// client/src/components/shopping-view/filter.jsx
import { Fragment } from "react";
import PropTypes from "prop-types";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton"; // Skeleton eklendi

function ProductFilter({
  filters,
  handleFilter,
  dynamicFilterOptions = {}, // Yeni prop, varsayılan boş obje
  isLoading = false, // Yeni prop, varsayılan false
}) {
  // Kategori ve marka için ayrı başlıklar (opsiyonel, daha iyi okunabilirlik için)
  const filterSections = [
    {
      id: "category",
      title: "Kategoriler",
      options: dynamicFilterOptions.category || [],
    },
    {
      id: "brand",
      title: "Markalar",
      options: dynamicFilterOptions.brand || [],
    },
  ];

  return (
    <div className="bg-background rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Filtrele</h2>
      </div>
      <div className="p-4 flex flex-col max-[600px]:flex-row max-[600px]:flex-wrap max-[600px]:justify-between gap-6">
        {" "}
        {/* Gap ayarlandı */}
        {isLoading
          ? // Yükleme sırasında iskelet gösterimi
            filterSections.map((section) => (
              <div
                key={`${section.id}-skeleton`}
                className="mt-0 flex-1 min-w-[150px]"
              >
                {" "}
                {/* min-width eklendi */}
                <Skeleton className="h-5 w-24 mb-3" /> {/* Başlık için */}
                <div className="grid gap-2 mt-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
            ))
          : // Filtreler yüklendikten sonra göster
            filterSections.map(
              (section) =>
                // Sadece seçenek varsa bölümü göster
                section.options.length > 0 && (
                  <Fragment key={section.id}>
                    <div className="mt-0 flex-1 min-w-[150px]">
                      {" "}
                      {/* min-width eklendi */}
                      <h3 className="text-base font-semibold mb-2">
                        {section.title}
                      </h3>{" "}
                      {/* Başlık stili */}
                      <div className="grid gap-2 mt-2">
                        {section.options.map((option) => (
                          <Label
                            key={option.id} // Artık option.id (slug olacak)
                            className="flex font-normal items-center gap-2 cursor-pointer hover:text-primary transition-colors" // Font ve hover efekti
                          >
                            <Checkbox
                              id={`${section.id}-${option.id}`} // Benzersiz ID
                              checked={
                                filters &&
                                filters[section.id] &&
                                filters[section.id].includes(option.id) // option.id (slug) kontrolü
                              }
                              onCheckedChange={() =>
                                handleFilter(section.id, option.id)
                              } // option.id (slug) gönder
                            />
                            {option.label} {/* Kategori/Marka adı */}
                          </Label>
                        ))}
                      </div>
                    </div>
                    {/* Dikey ayırıcı (opsiyonel, sadece yan yana ise anlamlı) */}
                    {/* <Separator orientation="vertical" className="h-auto mx-4 hidden md:block" /> */}
                  </Fragment>
                )
            )}
        {/* Eğer hiç filtre seçeneği yoksa mesaj göster */}
        {!isLoading &&
          filterSections.every((sec) => sec.options.length === 0) && (
            <p className="text-sm text-muted-foreground col-span-full text-center py-4">
              Filtre seçeneği bulunamadı.
            </p>
          )}
      </div>
    </div>
  );
}

ProductFilter.propTypes = {
  filters: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)), // Filtre değerleri string (slug) olacak
  handleFilter: PropTypes.func.isRequired,
  dynamicFilterOptions: PropTypes.shape({
    // Yeni prop tipi
    category: PropTypes.arrayOf(
      PropTypes.shape({ id: PropTypes.string, label: PropTypes.string })
    ),
    brand: PropTypes.arrayOf(
      PropTypes.shape({ id: PropTypes.string, label: PropTypes.string })
    ),
  }),
  isLoading: PropTypes.bool, // Yeni prop tipi
};

export default ProductFilter;
