const { calculateTip ,fahrenheitToCelsius,celsiusToFahrenheit} = require('./math')


test('test for calculting tip', () => { 
    const totalAmount = calculateTip(10, .3)
   expect(totalAmount).toBe(13)
})

test('Fahrenheit to celcius', () => {
    const totalAmount = fahrenheitToCelsius(32)
   expect(totalAmount).toBe(0)
})

test('celcius to fahrenHeit', () => {
    const totalAmount = celsiusToFahrenheit(0)
   expect(totalAmount).toBe(32)
})
