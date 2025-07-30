import { Fragment, useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Skeleton } from "../ui/skeleton";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Star, Filter, DollarSign, Award, Package, Tag, Building2 } from "lucide-react";

function ProductFilter({
  filters,
  handleFilter,
  handleScalarFilter,
  dynamicFilterOptions = {},
  isLoading = false,
}) {
  const [priceRange, setPriceRange] = useState([
    parseInt(filters.minPrice) || 0,
    parseInt(filters.maxPrice) || 1000000
  ]);
  
  const debounceTimerRef = useRef(null);

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

  // Debounced function for price filter
  const debouncedPriceFilter = useCallback((minPrice, maxPrice) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      handleScalarFilter("minPrice", minPrice === 0 ? "" : minPrice.toString());
      handleScalarFilter("maxPrice", maxPrice === 1000000 ? "" : maxPrice.toString());
    }, 300); 
  }, [handleScalarFilter]);

  // Fiyat aralığı değiştiğinde filtrele (debounced)
  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
    debouncedPriceFilter(newRange[0], newRange[1]);
  };

  // Filtreler değiştiğinde fiyat aralığını güncelle
  useEffect(() => {
    setPriceRange([
      parseInt(filters.minPrice) || 0,
      parseInt(filters.maxPrice) || 1000000
    ]);
  }, [filters.minPrice, filters.maxPrice]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="bg-gradient-to-br from-background to-muted/20 border p-1">
      <CardHeader className="pb-2 p-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Filter className="h-4 w-4 text-primary" />
          Filtrele
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-2">
        {/* Fiyat Aralığı - Kompakt */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Fiyat Aralığı</h3>
          
          <div className="space-y-2">
            <div className="px-1 py-1 bg-muted/30 rounded border">
              <Slider
                min={0}
                max={1000000}
                step={100}
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </div>

        {/* Minimum Puan - Kompakt */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium">Minimum Puan</h3>
          
          <Select
            value={filters.minRating || "all"}
            onValueChange={(value) => handleScalarFilter("minRating", value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-full h-8">
              <SelectValue placeholder="Hepsi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Hepsi
                </div>
              </SelectItem>
              <SelectItem value="1">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < 1 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span>1+ yıldız</span>
                </div>
              </SelectItem>
              <SelectItem value="2">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < 2 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span>2+ yıldız</span>
                </div>
              </SelectItem>
              <SelectItem value="3">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < 3 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span>3+ yıldız</span>
                </div>
              </SelectItem>
              <SelectItem value="4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span>4+ yıldız</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stok Durumu - Kompakt */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium">Stok Durumu</h3>
          
          <Label className="flex items-center gap-2 p-2 rounded border hover:bg-muted/50 cursor-pointer transition-colors">
            <Checkbox
              id="inStock"
              checked={filters.inStock === "true"}
              onCheckedChange={() =>
                handleScalarFilter(
                  "inStock",
                  filters.inStock === "true" ? "" : "true"
                )
              }
            />
            <span className="text-sm">Stokta Var/Yok</span>
            {filters.inStock === "true" && (
              <Badge variant="secondary" className="ml-auto text-xs">
                Aktif
              </Badge>
            )}
          </Label>
        </div>

        {/* Kategori / Marka - Kompakt */}
        <div className="space-y-3">
          {isLoading
            ? filterSections.map((section) => (
                <div key={`${section.id}-skeleton`} className="space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              ))
            : filterSections.map(
                (section) =>
                  section.options.length > 0 && (
                    <Fragment key={section.id}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium">{section.title}</h3>
                          {(filters[section.id] || []).length > 0 && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {(filters[section.id] || []).length}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {section.options.map((option) => {
                            const isChecked = (filters[section.id] || []).includes(option.id);
                            return (
                              <Label
                                key={option.id}
                                className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all hover:bg-muted/50 ${
                                  isChecked ? 'bg-primary/5 border-primary/20' : ''
                                }`}
                              >
                                <Checkbox
                                  id={`${section.id}-${option.id}`}
                                  checked={isChecked}
                                  onCheckedChange={() =>
                                    handleFilter(section.id, option.id)
                                  }
                                />
                                <span className={`text-sm flex-1 ${isChecked ? 'text-primary' : ''}`}>
                                  {option.displayLabel || option.label}
                                </span>
                                {isChecked && (
                                  <Badge variant="default" size="sm" className="text-xs">
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
              <div className="text-center py-8 text-muted-foreground">
                <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Filtre seçeneği bulunamadı.</p>
              </div>
            )}
        </div>

        {/* Aktif Filtreler Özeti - Kompakt */}
        {(Object.keys(filters).length > 0) && (
          <div className="mt-3 pt-3 border-t">
            <h4 className="text-xs font-semibold mb-2 text-muted-foreground">Aktif Filtreler</h4>
            <div className="flex flex-wrap gap-1">
              {filters.minPrice && (
                <Badge variant="outline" className="text-xs">Min: {formatPrice(parseInt(filters.minPrice))}</Badge>
              )}
              {filters.maxPrice && (
                <Badge variant="outline" className="text-xs">Max: {formatPrice(parseInt(filters.maxPrice))}</Badge>
              )}
              {filters.minRating && (
                <Badge variant="outline" className="text-xs">{filters.minRating}+ ⭐</Badge>
              )}
              {filters.inStock === "true" && (
                <Badge variant="outline" className="text-xs">Stokta Var</Badge>
              )}
              {filterSections.map(section => 
                (filters[section.id] || []).map(optionId => {
                  const option = section.options.find(opt => opt.id === optionId);
                  return option ? (
                    <Badge key={`${section.id}-${optionId}`} variant="outline" className="text-xs">
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
        displayLabel: PropTypes.string 
      })
    ),
    brand: PropTypes.arrayOf(
      PropTypes.shape({ id: PropTypes.string, label: PropTypes.string })
    ),
  }),
  isLoading: PropTypes.bool,
};

export default ProductFilter;
