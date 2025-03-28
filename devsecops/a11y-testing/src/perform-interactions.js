import { debugStep } from './debug-step.js';

export async function performInteractions(route, page, allResults) {
  // perfoms any interactions on the page such as filling in a form or expanding an acccordion
  switch (route) {
    case '/':
      console.log('Interacting with homepage...');

      // await debugStep(page, 'before-latitude-input');

      try {
        // get latitude gcds-input field
        await page.waitForSelector('gcds-input[name="latitude"]', {
          visible: true,
          timeout: 10000,
        });

        // Set latitude value inside shadow DOM
        await page.evaluate(() => {
          const el = document.querySelector('gcds-input[name="latitude"]');
          const input = el?.shadowRoot?.querySelector('input');
          if (input) {
            input.value = '45.1234';
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });

        // await debugStep(page, 'after-latitude-input');

        //  get longitude gcds-input field
        await page.waitForSelector('gcds-input[name="longitude"]', {
          visible: true,
          timeout: 10000,
        });

        // Set longitude value inside shadow DOM
        await page.evaluate(() => {
          const el = document.querySelector('gcds-input[name="longitude"]');
          const input = el?.shadowRoot?.querySelector('input');
          if (input) {
            input.value = '-75.7007';
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });

        // await debugStep(page, 'after-longitude-input');

        // await page.evaluate(() => {
        //   const buttons = Array.from(document.querySelectorAll('gcds-button'));
        //   const searchButton = buttons.find(btn => btn.textContent?.includes('Search the coordinates'));

        //   if (!searchButton) {
        //     console.warn('[page] Could not find the "Search the coordinates" button');
        //     return;
        //   }

        //   console.log('[page] Found search button, attempting to click');
        //   searchButton.scrollIntoView({ behavior: 'instant', block: 'center' });

        //   searchButton.click();

        //   // // Try to dispatch the click event manually
        //   // searchButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        //    // Follow with dispatch, in case native click doesn't work
        //   console.log('[page] Dispatching real MouseEvent click...');
        //   const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        //   searchButton.dispatchEvent(event);
        // });

        const buttons = await page.$$('gcds-button');
        for (const button of buttons) {
          const text = await page.evaluate((el) => el.textContent, button);
          if (text.includes('Search the coordinates')) {
            console.log(
              '[test] Found search button, clicking with Puppeteer...',
            );
            await button.evaluate((el) =>
              el.scrollIntoView({ behavior: 'instant', block: 'center' }),
            );
            await button.click();
            break;
          }
        }

        // wait 10 seconds
        await new Promise((resolve) => setTimeout(resolve, 10000));
        await debugStep(page, 'after-puppeteer-click');

        // Try waiting for something new to appear — like a map
        try {
          await page.waitForSelector('canvas', {
            visible: true,
            timeout: 5000,
          });
          console.log('[test] Canvas appeared after clicking!');
        } catch (e) {
          console.warn('[test] Canvas did not appear after click.');
        }

        try {
          await page.waitForFunction(
            () => {
              return Array.from(document.querySelectorAll('gcds-heading')).some(
                (h) => h.textContent?.includes('Information returned:'),
              );
            },
            { timeout: 5000 },
          );
          console.log('[test] "Information returned" heading found!');
        } catch (e) {
          console.warn('[test] Heading not found after click.');
        }

        // Step 2: Axe analysis after interaction
        const coordResults = await new AxePuppeteer(page).analyze();
        allResults.push({
          url: `${page.url()}-after-coordinates`,
          results: coordResults,
        });
      } catch (err) {
        console.warn(`Failed interaction on ${route}:`, err.message);
        await debugStep(page, `error-${route}`);
      }

      break;

    //   // Step 2: Search by address
    //   try {
    //     await page.waitForSelector('input[name="address"]');
    //     await page.type('input[name="address"]', '1000 Airport Parkway Private');

    //     await page.waitForSelector('input[name="city"]');
    //     await page.type('input[name="city"]', 'Ottawa');

    //     await page.waitForSelector('input[name="province"]');
    //     await page.type('input[name="province"]', 'Ontario');

    //     await page.waitForSelector('gcds-button[button-id="Search the address"]');
    //     await page.click('gcds-button[button-id="Search the address"]');

    //     await page.waitForTimeout(2000); // or wait for result

    //     // Scan after address search
    //     const addressResults = await new AxePuppeteer(page).analyze();
    //     allResults.push({
    //       url: `${page.url()}-after-address`,
    //       results: addressResults,
    //     });
    //   } catch (err) {
    //     console.warn(`Failed coordinate search interaction on ${route}:`, err.message);
    //   }

    //   break;

    // case '/reverse-geocoding-bulk':
    //   console.log('Interacting with reverse geocoding page...');
    //   try {
    //     await page.type('#reverse-input', '45.4236, -75.7009'); // example input
    //     await page.click('#submit-reverse'); // simulate form submit
    //     await page.waitForSelector('.reverse-results'); // wait for results to appear
    //   } catch (err) {
    //     console.warn(`Failed coordinate search interaction on ${route}:`, err.message);
    //   }
    //   break;

    // case '/bulk-address-geocoding':
    //   console.log('Interacting with bulk address geocoding page...');
    //   // If there’s a file upload component or textarea
    //   try {
    //     await page.type('#bulk-address-input', '123 Main St\n456 Elm St');
    //     await page.click('#bulk-submit');
    //     await page.waitForSelector('.bulk-results');
    //   } catch (err) {
    //     console.warn(`Failed coordinate search interaction on ${route}:`, err.message);
    //   }
    //   break;

    default:
      console.log(`No interactions defined for ${route}`);
      break;
  }
}
