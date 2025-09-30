import { useState, useMemo } from "react";
import { mockPositions } from "@/data/positions";
import { Position, PositionCategory } from "@/types/position";
import PositionCard from "@/components/PositionCard";
import ApplicationModal from "@/components/ApplicationModal";
import MyApplications from "@/components/MyApplications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, GraduationCap } from "lucide-react";

const Positions = () => {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const departments = useMemo(() => {
    const depts = Array.from(new Set(mockPositions.map((p) => p.department)));
    return depts.sort();
  }, []);

  const categories: PositionCategory[] = ["catedra", "corrector", "laboratorio"];

  const filteredPositions = useMemo(() => {
    return mockPositions.filter((position) => {
      const matchesSearch =
        position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        departmentFilter === "all" || position.department === departmentFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        (position.categories && position.categories.includes(categoryFilter as PositionCategory));

      const matchesStatus = statusFilter === "all" || position.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesCategory && matchesStatus;
    });
  }, [searchTerm, departmentFilter, categoryFilter, statusFilter]);

  const handleApply = (position: Position) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-b from-card via-card to-background border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">PAU - Ayudantías</h1>
              <p className="text-sm text-muted-foreground">Plataforma de Ayudantías Unificadas</p>
            </div>
          </div>
          
          <Tabs defaultValue="positions" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="positions">Ayudantías Disponibles</TabsTrigger>
              <TabsTrigger value="applications">Mis Postulaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="positions" className="mt-6 space-y-6">
              <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border/50 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por nombre o departamento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Filtros:</span>

                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Departamento" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="all">Todos los departamentos</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="capitalize">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="open">Abiertas</SelectItem>
                      <SelectItem value="closed">Cerradas</SelectItem>
                    </SelectContent>
                  </Select>

                  {(departmentFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDepartmentFilter("all");
                        setCategoryFilter("all");
                        setStatusFilter("all");
                      }}
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              </div>

              <div className="pb-8">
                {filteredPositions.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground">
                      No se encontraron ayudantías con los filtros seleccionados
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPositions.map((position) => (
                      <PositionCard key={position.id} position={position} onApply={handleApply} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="applications" className="mt-6">
              <div className="pb-8">
                <MyApplications />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </header>

      <ApplicationModal
        position={selectedPosition}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPosition(null);
        }}
      />
    </div>
  );
};

export default Positions;
