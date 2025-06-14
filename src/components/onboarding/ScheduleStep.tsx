import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Clock, Copy, Coffee } from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { WorkingHours } from "@/lib/onboardingTypes";

export const ScheduleStep: React.FC = () => {
  const { data, updateWorkingHours, nextStep, previousStep } = useOnboarding();

  const handleNextStep = () => {
    console.log("ScheduleStep: Tentando avançar para próxima etapa");
    console.log("Current step:", data.currentStep);
    console.log("Working hours:", localHours);
    nextStep();
  };
  const [localHours, setLocalHours] = useState<WorkingHours[]>(
    data.workingHours,
  );
  const [showLunchBreak, setShowLunchBreak] = useState<{
    [key: string]: boolean;
  }>({});

  const updateDayHours = (dayIndex: number, updates: Partial<WorkingHours>) => {
    const newHours = [...localHours];
    newHours[dayIndex] = { ...newHours[dayIndex], ...updates };
    setLocalHours(newHours);
    updateWorkingHours(newHours);
  };

  const copyToAllDays = (sourceDay: WorkingHours) => {
    const newHours = localHours.map((day) => ({
      ...day,
      isOpen: sourceDay.isOpen,
      openTime: sourceDay.openTime,
      closeTime: sourceDay.closeTime,
      lunchBreak: sourceDay.lunchBreak,
    }));
    setLocalHours(newHours);
    updateWorkingHours(newHours);
  };

  const handleLunchBreakToggle = (dayIndex: number, enabled: boolean) => {
    const dayName = localHours[dayIndex].day;
    setShowLunchBreak((prev) => ({ ...prev, [dayName]: enabled }));

    if (enabled) {
      updateDayHours(dayIndex, {
        lunchBreak: { start: "12:00", end: "13:00" },
      });
    } else {
      updateDayHours(dayIndex, {
        lunchBreak: undefined,
      });
    }
  };

  const formatTimeDisplay = (time: string) => {
    return time || "00:00";
  };

  const getWorkingHoursSummary = () => {
    const openDays = localHours.filter((day) => day.isOpen);
    if (openDays.length === 0) return "Nenhum dia configurado";

    const firstDay = openDays[0];
    const allSame = openDays.every(
      (day) =>
        day.openTime === firstDay.openTime &&
        day.closeTime === firstDay.closeTime,
    );

    if (allSame && openDays.length === 7) {
      return `Todos os dias: ${formatTimeDisplay(firstDay.openTime)} - ${formatTimeDisplay(firstDay.closeTime)}`;
    } else if (allSame && openDays.length === 6) {
      const closedDay = localHours.find((day) => !day.isOpen);
      return `${formatTimeDisplay(firstDay.openTime)} - ${formatTimeDisplay(firstDay.closeTime)} (exceto ${closedDay?.day})`;
    } else {
      return `${openDays.length} dias configurados`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Horários de Funcionamento
        </h2>
        <p className="text-gray-600">
          Configure os horários de funcionamento do seu estabelecimento
        </p>
      </div>

      <div className="space-y-6">
        {/* Quick Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Configuração Rápida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Configure um dia e copie para todos os outros dias da semana
            </p>
            <div className="flex flex-wrap gap-2">
              {localHours.map(
                (day, index) =>
                  day.isOpen && (
                    <Button
                      key={day.day}
                      variant="outline"
                      size="sm"
                      onClick={() => copyToAllDays(day)}
                      className="flex items-center"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copiar {day.day}
                    </Button>
                  ),
              )}
            </div>
          </CardContent>
        </Card>

        {/* Schedule Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Configuração Detalhada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {localHours.map((day, index) => (
                <div
                  key={day.day}
                  className={`p-4 border rounded-lg ${
                    day.isOpen
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-900">{day.day}</h3>
                      <Switch
                        checked={day.isOpen}
                        onCheckedChange={(checked) =>
                          updateDayHours(index, { isOpen: checked })
                        }
                      />
                      <span className="text-sm text-gray-600">
                        {day.isOpen ? "Aberto" : "Fechado"}
                      </span>
                    </div>

                    {day.isOpen && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToAllDays(day)}
                        className="flex items-center"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copiar para todos
                      </Button>
                    )}
                  </div>

                  {day.isOpen && (
                    <div className="space-y-4">
                      {/* Working Hours */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`open-${index}`}>
                            Horário de Abertura
                          </Label>
                          <Input
                            id={`open-${index}`}
                            type="time"
                            value={day.openTime}
                            onChange={(e) =>
                              updateDayHours(index, {
                                openTime: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`close-${index}`}>
                            Horário de Fechamento
                          </Label>
                          <Input
                            id={`close-${index}`}
                            type="time"
                            value={day.closeTime}
                            onChange={(e) =>
                              updateDayHours(index, {
                                closeTime: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* Lunch Break Toggle */}
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={showLunchBreak[day.day] || !!day.lunchBreak}
                          onCheckedChange={(checked) =>
                            handleLunchBreakToggle(index, checked)
                          }
                        />
                        <div className="flex items-center">
                          <Coffee className="w-4 h-4 mr-2 text-orange-500" />
                          <span className="text-sm font-medium">
                            Pausa para almoço
                          </span>
                        </div>
                      </div>

                      {/* Lunch Break Hours */}
                      {(showLunchBreak[day.day] || day.lunchBreak) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-orange-200">
                          <div>
                            <Label htmlFor={`lunch-start-${index}`}>
                              Início do Almoço
                            </Label>
                            <Input
                              id={`lunch-start-${index}`}
                              type="time"
                              value={day.lunchBreak?.start || "12:00"}
                              onChange={(e) =>
                                updateDayHours(index, {
                                  lunchBreak: {
                                    ...day.lunchBreak,
                                    start: e.target.value,
                                    end: day.lunchBreak?.end || "13:00",
                                  },
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`lunch-end-${index}`}>
                              Fim do Almoço
                            </Label>
                            <Input
                              id={`lunch-end-${index}`}
                              type="time"
                              value={day.lunchBreak?.end || "13:00"}
                              onChange={(e) =>
                                updateDayHours(index, {
                                  lunchBreak: {
                                    ...day.lunchBreak,
                                    start: day.lunchBreak?.start || "12:00",
                                    end: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                      )}

                      {/* Hours Summary */}
                      <div className="text-sm text-gray-600 bg-white p-2 rounded border">
                        <strong>Resumo:</strong>{" "}
                        {formatTimeDisplay(day.openTime)} às{" "}
                        {formatTimeDisplay(day.closeTime)}
                        {day.lunchBreak && (
                          <span>
                            {" "}
                            (pausa: {formatTimeDisplay(
                              day.lunchBreak.start,
                            )} às {formatTimeDisplay(day.lunchBreak.end)})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo dos Horários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                {getWorkingHoursSummary()}
              </p>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Dias abertos:</strong>{" "}
                  {localHours.filter((day) => day.isOpen).length} de 7 dias
                </p>
                {localHours.some((day) => day.lunchBreak) && (
                  <p>
                    <strong>Dias com pausa para almoço:</strong>{" "}
                    {localHours.filter((day) => day.lunchBreak).length} dias
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">💡</span>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">
                  Dicas importantes:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • Você pode alterar estes horários a qualquer momento nas
                    configurações
                  </li>
                  <li>
                    • Os horários de pausa são importantes para não agendar
                    serviços durante o almoço
                  </li>
                  <li>
                    • Profissionais podem ter horários específicos diferentes do
                    estabelecimento
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={previousStep}>
          Voltar
        </Button>
        <Button
          onClick={handleNextStep}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Próximo: Revisão
        </Button>
      </div>
    </div>
  );
};
