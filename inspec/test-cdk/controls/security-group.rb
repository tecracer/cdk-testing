# encoding: utf-8
# copyright: 2018, The Authors


control 'aws-region-security-group-1.0' do

  impact 1.0
  title 'Ensure AWS Security Groups disallow ssh ingress from 0.0.0.0/0.'


  describe aws_security_group(group_name: 'FrontEnd', vpc_id: 'vpc-0f66cf8e7918f109c') do
    it { should exist }
    it { should_not allow_in(ipv4_range: '0.0.0.0/0', port: 22) }
  end

end