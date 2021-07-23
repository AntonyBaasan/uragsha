const listId = '03e432ba01'; // name is 'UragshaInterestedUsers'

class MailchimpService {
  constructor(private mailchimp: any) {}

  async ping() {
    const response = await this.mailchimp.ping.get();
    return response;
  }

  async subscritionRequest(email: string) {
    const subscribingUser = { email };
    const response = await this.mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: 'subscribed',
    });
    console.log('mailchimp response ', response);
    return response.id;
  }
}
export { MailchimpService };
