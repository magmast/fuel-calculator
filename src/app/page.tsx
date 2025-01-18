"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Decimal from "decimal.js";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import v from "validator";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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
    const subscription = form.watch(() =>
      form.handleSubmit(handleSubmit, () => setResult(undefined))(),
    );

    return () => subscription.unsubscribe();
  }, [form, handleSubmit]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-8 p-4">
      <h1 className="text-center text-2xl font-bold">Fuel price calculator</h1>

      <Form {...form}>
        <form className="flex w-full flex-col gap-4">
          <FormField
            control={form.control}
            name="distance"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel
                  className={fieldState.isTouched ? undefined : "text-black"}
                >
                  Distance (km)
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                {fieldState.isTouched && <FormMessage />}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fuelConsumption"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel
                  className={fieldState.isTouched ? undefined : "text-black"}
                >
                  Fuel consumption (l/100 km)
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                {fieldState.isTouched && <FormMessage />}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fuelPrice"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel
                  className={fieldState.isTouched ? undefined : "text-black"}
                >
                  Fuel price (zł/l)
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                {fieldState.isTouched && <FormMessage />}
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Travel price</FormLabel>
            <Input
              value={
                result ? result.toFixed(2) : "Fill the form to see the result"
              }
              disabled
            />
          </FormItem>
        </form>
      </Form>
    </main>
  );
}
