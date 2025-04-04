"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Decimal from "decimal.js";
import { m } from "motion/react";
import { parseAsString, useQueryStates } from "nuqs";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import v from "validator";
import { z } from "zod";

import { MFormItem } from "@/components/motion";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const variants = {
  hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
};

const decimal = z
  .string()
  .refine((value) => !v.isEmpty(value), "Must not be empty.")
  .transform((value) => value.replaceAll(",", "."))
  .refine(v.isFloat, "Must be a number.")
  .transform((value) => new Decimal(value));

const schema = z.object({
  distance: decimal,
  fuelConsumption: decimal,
  fuelPrice: decimal,
});

export default function Home() {
  const [query, setQuery] = useQueryStates(
    {
      distance: parseAsString.withDefault(""),
      fuelConsumption: parseAsString.withDefault(""),
      fuelPrice: parseAsString.withDefault(""),
    },
    { urlKeys: { distance: "d", fuelConsumption: "c", fuelPrice: "p" } },
  );

  const form = useForm<
    z.input<typeof schema>,
    unknown,
    z.output<typeof schema>
  >({
    resolver: zodResolver(schema),
    shouldFocusError: false,
    defaultValues: {
      distance: "",
      fuelConsumption: "",
      fuelPrice: "",
    },
    mode: "onChange",
  });

  const [result, setResult] = useState<Decimal>();

  const handleSubmit = useCallback(
    ({ distance, fuelConsumption, fuelPrice }: z.output<typeof schema>) => {
      setResult(
        fuelConsumption.times(fuelPrice).times(distance.div(new Decimal(100))),
      );
    },
    [],
  );

  useEffect(() => {
    form.reset(query);
    form.handleSubmit(handleSubmit, () => setResult(undefined))();
  }, [form, handleSubmit, query]);

  useEffect(() => {
    const subscription = form.watch((values) => setQuery(values));
    return () => subscription.unsubscribe();
  }, [form, setQuery]);

  return (
    <m.main
      className="flex min-h-screen items-center bg-gradient-to-b from-background to-secondary/20 p-4 md:p-8"
      initial="hidden"
      animate="visible"
      transition={{
        staggerChildren: 0.15,
        delayChildren: 0.2,
        when: "beforeChildren",
      }}
    >
      <m.div variants={variants} className="mx-auto w-full max-w-xl">
        <m.div className="mb-12 space-y-4 text-center" variants={variants}>
          <h1 className="text-4xl font-bold tracking-tight">
            Fuel Price Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate the cost of your journey based on distance and fuel
            consumption
          </p>
        </m.div>

        <m.div
          className="rounded-lg border bg-card p-6 shadow-sm"
          variants={variants}
        >
          <Form {...form}>
            <form className="flex w-full flex-col gap-6">
              <FormField
                control={form.control}
                name="distance"
                render={({ field, fieldState }) => (
                  <MFormItem variants={variants}>
                    <FormLabel
                      className={
                        fieldState.isTouched ? undefined : "text-foreground"
                      }
                    >
                      Distance (km)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 100" {...field} />
                    </FormControl>
                    {fieldState.isTouched && <FormMessage />}
                  </MFormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuelConsumption"
                render={({ field, fieldState }) => (
                  <MFormItem variants={variants}>
                    <FormLabel
                      className={
                        fieldState.isTouched ? undefined : "text-foreground"
                      }
                    >
                      Fuel consumption (l/100 km)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 7.5" {...field} />
                    </FormControl>
                    {fieldState.isTouched && <FormMessage />}
                  </MFormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuelPrice"
                render={({ field, fieldState }) => (
                  <MFormItem variants={variants}>
                    <FormLabel
                      className={
                        fieldState.isTouched ? undefined : "text-foreground"
                      }
                    >
                      Fuel price (zł/l)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 6.50" {...field} />
                    </FormControl>
                    {fieldState.isTouched && <FormMessage />}
                  </MFormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Travel price (zł)</FormLabel>
                <div className="relative">
                  <Input
                    value={
                      result
                        ? result.toFixed(2)
                        : "Fill the form to see the result"
                    }
                    disabled
                    className="bg-secondary/50 text-lg font-medium"
                  />
                  {result && (
                    <m.div
                      className="absolute right-3 top-1/2 text-sm text-muted-foreground"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transformTemplate={(_, generated) =>
                        `${generated} translateY(-50%)`
                      }
                    >
                      PLN
                    </m.div>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </m.div>
      </m.div>
    </m.main>
  );
}
