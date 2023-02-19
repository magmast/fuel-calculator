import Button from "@/components/Button";
import Input from "@/components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import Decimal from "decimal.js";
import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import v from "validator";
import { z } from "zod";

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

const Home = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const [result, setResult] = useState<Decimal>();

  return (
    <main className="p-4 min-h-screen flex flex-col justify-center gap-4">
      <Head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />

        <title>Fuel Price Calculator</title>
      </Head>

      <h1 className="text-xl text-center">Fuel price calculator</h1>

      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit(({ distance, fuelConsumption, fuelPrice }) =>
          setResult(
            fuelConsumption
              .times(fuelPrice)
              .times(distance.div(new Decimal(100)))
          )
        )}
      >
        <Input
          {...register("distance")}
          placeholder="Distance"
          suffix="km"
          error={errors.distance?.message}
        />

        <Input
          {...register("fuelConsumption")}
          placeholder="Fuel consumption"
          suffix="l/100 km"
          error={errors.fuelConsumption?.message}
        />

        <Input
          {...register("fuelPrice")}
          placeholder="Fuel price"
          suffix="zł/l"
          error={errors.fuelPrice?.message}
        />

        <Button type="submit">CALCULATE</Button>
      </form>

      {result && (
        <p className="text-center bg-gray-100 p-2 rounded">
          You&apos;ll pay {result.toFixed(2)} zł for fuel.
        </p>
      )}
    </main>
  );
};

export default Home;
