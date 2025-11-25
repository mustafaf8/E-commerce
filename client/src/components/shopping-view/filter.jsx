import { Fragment, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Skeleton } from "../ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Filter, Tag, Building2 } from "lucide-react";

function ProductFilter({
  filters,
  handleFilter,
  handleScalarFilter,
  dynamicFilterOptions = {},
  isLoading = false,
}) {
  // Slider'ın görsel olarak akıcı çalışması için anlık değeri tutan state
  const [displayPriceRange, setDisplayPriceRange] = useState([
    parseInt(filters.minPrice) || 0,
    parseInt(filters.maxPrice) || 1000000,
  ]);

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

  // Sadece sürükleme bittiğinde filtreyi uygula
  const handlePriceCommit = useCallback(
    (newRange) => {
      handleScalarFilter(
        "minPrice",
        newRange[0] === 0 ? "" : newRange[0].toString()
      );
      handleScalarFilter(
        "maxPrice",
        newRange[1] === 1000000 ? "" : newRange[1].toString()
      );
    },
    [handleScalarFilter]
  );

  // Sadece component ilk yüklendiğinde görsel state'i başlat
  useEffect(() => {
    setDisplayPriceRange([
      parseInt(filters.minPrice) || 0,
      parseInt(filters.maxPrice) || 1000000,
    ]);
  }, []); // Sadece ilk yüklemede çalışsın, hiçbir dependency yok

  const formatPrice = (price) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const sectionHeader = (title, icon) => (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {icon}
      <span>{title}</span>
    </div>
  );

  return (
    <Card className="border-muted bg-background/70 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-2 px-3 py-3 border-b">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Filter className="h-4 w-4 text-primary" />
          Akıllı Filtreler
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-3">
        {/* Fiyat Aralığı */}
        <div className="space-y-2 rounded-lg border border-dashed border-muted bg-muted/20 p-3">
          {sectionHeader("Fiyat Aralığı", <Tag className="h-3.5 w-3.5" />)}
          <div className="space-y-2 pt-1">
            <Slider
              min={0}
              max={1000000}
              step={10}
              value={displayPriceRange}
              onValueChange={setDisplayPriceRange}
              onValueCommit={handlePriceCommit}
              className="w-full"
            />
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
              <span className="rounded-md bg-background px-2 py-0.5 shadow-sm">
                {formatPrice(displayPriceRange[0])}
              </span>
              <span className="rounded-md bg-background px-2 py-0.5 shadow-sm">
                {formatPrice(displayPriceRange[1])}
              </span>
            </div>
          </div>
        </div>

        {/* Stok Durumu */}
        <div className="space-y-2 rounded-lg border border-dashed border-muted/70 bg-muted/10 p-3">
          {sectionHeader("Stok Durumu")}
          <Label className="flex items-center gap-2 rounded-md border bg-background px-2 py-1.5 text-xs hover:bg-muted/40 cursor-pointer transition-colors">
            <Checkbox
              id="inStock"
              checked={filters.inStock === "true"}
              onCheckedChange={() =>
                handleScalarFilter(
                  "inStock",
                  filters.inStock === "true" ? "" : "true"
                )
              }
              aria-label="Stokta Var/Yok"
            />
            <span className="text-xs font-medium">Sadece stoktakiler</span>
            {filters.inStock === "true" && (
              <Badge variant="secondary" className="ml-auto text-[10px]">
                Aktif
              </Badge>
            )}
          </Label>
        </div>

        {/* Kategori / Marka */}
        <div className="space-y-3">
          {isLoading
            ? filterSections.map((section) => (
                <div key={`${section.id}-skeleton`} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-20 w-full rounded-md" />
                </div>
              ))
            : filterSections.map(
                (section) =>
                  section.options.length > 0 && (
                    <Fragment key={section.id}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {section.id === "category" ? (
                            <Tag className="h-3.5 w-3.5" />
                          ) : (
                            <Building2 className="h-3.5 w-3.5" />
                          )}
                          <h3>{section.title}</h3>
                          {(filters[section.id] || []).length > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-auto text-[10px]"
                            >
                              {(filters[section.id] || []).length}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-1.5 max-h-44 overflow-y-auto rounded-md border border-dashed border-muted/60 bg-muted/10 p-2">
                          {section.options.map((option) => {
                            const isChecked = (
                              filters[section.id] || []
                            ).includes(option.id);
                            return (
                              <Label
                                key={option.id}
                                className={`flex items-center gap-1.5 rounded-md border bg-background px-2 py-1 text-xs cursor-pointer transition-all hover:bg-muted/30 ${
                                  isChecked ? "border-primary/40" : ""
                                }`}
                              >
                                <Checkbox
                                  id={`${section.id}-${option.id}`}
                                  checked={isChecked}
                                  onCheckedChange={() =>
                                    handleFilter(section.id, option.id)
                                  }
                                  aria-label={`${section.id}-${option.id}`}
                                />
                                <span
                                  className={`flex-1 text-[11px] ${
                                    isChecked
                                      ? "text-primary font-semibold"
                                      : ""
                                  }`}
                                >
                                  {option.displayLabel || option.label}
                                </span>
                                {isChecked && (
                                  <Badge
                                    variant="default"
                                    className="text-[10px] px-1 py-0"
                                  >
                                    ✓
                                  </Badge>
                                )}
                              </Label>
                            );
                          })}
                        </div>
                      </div>
                    </Fragment>
                  )
              )}

          {!isLoading &&
            filterSections.every((sec) => sec.options.length === 0) && (
              <div className="text-center py-6 text-muted-foreground text-xs">
                <Filter className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p>Filtre seçeneği bulunamadı.</p>
              </div>
            )}
        </div>

        {/* Aktif Filtreler */}
        {Object.keys(filters).length > 0 && (
          <div className="border-t pt-3">
            <h4 className="text-[11px] font-semibold mb-2 text-muted-foreground">
              Aktif Filtreler
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {filters.minPrice && (
                <Badge variant="outline" className="text-[10px]">
                  Min: {formatPrice(parseInt(filters.minPrice))}
                </Badge>
              )}
              {filters.maxPrice && (
                <Badge variant="outline" className="text-[10px]">
                  Max: {formatPrice(parseInt(filters.maxPrice))}
                </Badge>
              )}
              {filters.inStock === "true" && (
                <Badge variant="outline" className="text-[10px]">
                  Stokta Var
                </Badge>
              )}
              {filterSections.map((section) =>
                (filters[section.id] || []).map((optionId) => {
                  const option = section.options.find(
                    (opt) => opt.id === optionId
                  );
                  return option ? (
                    <Badge
                      key={`${section.id}-${optionId}`}
                      variant="outline"
                      className="text-[10px]"
                    >
                      {option.displayLabel || option.label}
                    </Badge>
                  ) : null;
                })
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

ProductFilter.propTypes = {
  filters: PropTypes.object,
  handleFilter: PropTypes.func.isRequired,
  handleScalarFilter: PropTypes.func.isRequired,
  dynamicFilterOptions: PropTypes.shape({
    category: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        displayLabel: PropTypes.string,
      })
    ),
    brand: PropTypes.arrayOf(
      PropTypes.shape({ id: PropTypes.string, label: PropTypes.string })
    ),
  }),
  isLoading: PropTypes.bool,
};

export default ProductFilter;
