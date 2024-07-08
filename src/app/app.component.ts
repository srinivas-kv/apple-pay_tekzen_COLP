import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    private loaded = false;

    constructor(private renderer: Renderer2) { }

    ngOnInit() {
        this.loadPayPalScript();
    }

    loadPayPalScript() {
        if (this.loaded) {
            this.renderPayPalButtons();
            return;
        }

        const script = this.renderer.createElement('script');
        script.src = 'https://www.paypal.com/sdk/js?client-id=AaF3x4iq4bsKKonOBX9fVMarJwTojQJYfN5D4jMXdxw3odvvLOkj-EWqTmzus7miBn35D9XrhhbfRKGA&components=buttons,funding-eligibility&enable-funding=applepay';
        script.onload = () => {
            this.loaded = true;
            this.renderPayPalButtons();
        };
        script.onerror = () => console.error('PayPal SDK could not be loaded.');
        this.renderer.appendChild(document.head, script);
    }

    renderPayPalButtons() {
        const paypal = (window as any).paypal;

        if (!paypal) {
            console.error('PayPal SDK not loaded');
            return;
        }

        // Render PayPal and Debit/Credit Card buttons within the same container
        paypal.Buttons({
            fundingSource: undefined, // This enables all eligible funding sources
            style: {
                layout: 'vertical',
                color: 'gold',
                shape: 'rect',
                label: 'paypal'
            },
            createOrder: (data: any, actions: any) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: '1.00'
                        }
                    }]
                });
            },
            onApprove: (data: any, actions: any) => {
                return actions.order.capture().then((details: any) => {
                    alert('Transaction completed by ' + details.payer.name.given_name);
                });
            },
            onError: (err: any) => {
                console.error('PayPal error', err);
            }
        }).render('#payment-button-container');

    }
}
