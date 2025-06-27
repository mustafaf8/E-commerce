import { Fragment } from "react";
import PropTypes from "prop-types";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Skeleton } from "../ui/skeleton";

function ProductFilter({
  filters,
  handleFilter,
  dynamicFilterOptions = {},
  isLoading = false,
}) {
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
      <div className="p-4 flex flex-col max-[767px]:flex-row max-[767px]:justify-between gap-6">
        {isLoading
          ? filterSections.map((section) => (
              <div
                key={`${section.id}-skeleton`}
                className="mt-0 flex-1 min-w-[150px]"
              >
                <Skeleton className="h-5 w-24 mb-3" />
                <div className="grid gap-2 mt-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
            ))
          : filterSections.map(
              (section) =>
                section.options.length > 0 && (
                  <Fragment key={section.id}>
                    <div className="mt-0 flex-1 min-w-[150px]">
                      <h3 className="text-base font-semibold mb-2">
                        {section.title}
                      </h3>
                      <div className="grid gap-2 mt-2">
                        {section.options.map((option) => (
                          <Label
                            key={option.id}
                            className="flex font-normal items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                          >
                            <Checkbox
                              id={`${section.id}-${option.id}`}
                              checked={(filters[section.id] || []).includes(
                                option.id
                              )}
                              onCheckedChange={() =>
                                handleFilter(section.id, option.id)
                              }
                            />
                            {option.label}
                          </Label>
                        ))}
                      </div>
                    </div>
                  </Fragment>
                )
            )}
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
  filters: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  handleFilter: PropTypes.func.isRequired,
  dynamicFilterOptions: PropTypes.shape({
    category: PropTypes.arrayOf(
      PropTypes.shape({ id: PropTypes.string, label: PropTypes.string })
    ),
    brand: PropTypes.arrayOf(
      PropTypes.shape({ id: PropTypes.string, label: PropTypes.string })
    ),
  }),
  isLoading: PropTypes.bool,
};

export default ProductFilter;
